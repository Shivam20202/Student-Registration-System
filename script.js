  /* ──────────────────────────────────────────────
     CONSTANTS & STATE
  ────────────────────────────────────────────── */
  const STORAGE_KEY    = 'srs_students';
  let   students       = [];
  let   editingUid     = null;   // uid being edited in the modal
  let   pendingDelUid  = null;   // uid queued for deletion

  /* ──────────────────────────────────────────────
     DOM REFERENCES — Main
  ────────────────────────────────────────────── */
  const nameInput    = document.getElementById('studentName');
  const idInput      = document.getElementById('studentId');
  const emailInput   = document.getElementById('emailId');
  const contactInput = document.getElementById('contactNo');
  const addBtn       = document.getElementById('addBtn');
  const tableBody    = document.getElementById('tableBody');
  const totalCount   = document.getElementById('totalCount');
  const emptyState   = document.getElementById('emptyState');
  const tableWrap    = document.getElementById('tableWrap');
  const searchInput  = document.getElementById('searchInput');
  const toast        = document.getElementById('toast');
  let   toastTimer;

  /* ──────────────────────────────────────────────
     DOM REFERENCES — Edit Modal
  ────────────────────────────────────────────── */
  const editModal      = document.getElementById('editModal');
  const editModalClose = document.getElementById('editModalClose');
  const editCancelBtn  = document.getElementById('editCancelBtn');
  const editSaveBtn    = document.getElementById('editSaveBtn');
  const editName       = document.getElementById('editName');
  const editId         = document.getElementById('editId');
  const editEmail      = document.getElementById('editEmail');
  const editContact    = document.getElementById('editContact');

  /* ──────────────────────────────────────────────
     DOM REFERENCES — Delete Modal
  ────────────────────────────────────────────── */
  const deleteModal       = document.getElementById('deleteModal');
  const deleteModalClose  = document.getElementById('deleteModalClose');
  const deleteCancelBtn   = document.getElementById('deleteCancelBtn');
  const deleteConfirmBtn  = document.getElementById('deleteConfirmBtn');
  const deleteStudentName = document.getElementById('deleteStudentName');

  /* ──────────────────────────────────────────────
     FOOTER YEAR
  ────────────────────────────────────────────── */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  /* ──────────────────────────────────────────────
     LOCAL STORAGE
  ────────────────────────────────────────────── */
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      students  = raw ? JSON.parse(raw) : [];
    } catch (e) { students = []; }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  /* ──────────────────────────────────────────────
     VALIDATION RULES
  ────────────────────────────────────────────── */
  const VALIDATORS = {
    name:    v => /^[a-zA-Z\s]{2,}$/.test(v.trim()),
    id:      v => /^\d+$/.test(v.trim()),
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    contact: v => /^\d{10,}$/.test(v.trim()),
  };

  /**
   * Validate a single input field and toggle error UI.
   * @param {HTMLInputElement} input
   * @param {string} type   - key in VALIDATORS
   * @param {string} errId  - id of .error-msg element
   * @returns {boolean}
   */
  function validateField(input, type, errId) {
    const valid = VALIDATORS[type](input.value);
    const errEl = document.getElementById(errId);
    if (valid) {
      input.classList.remove('error');
      errEl.classList.remove('show');
    } else {
      input.classList.add('error');
      errEl.classList.add('show');
    }
    return valid;
  }

  /** Validate the main registration form fields. */
  function validateMainForm() {
    const a = validateField(nameInput,    'name',    'nameErr');
    const b = validateField(idInput,      'id',      'idErr');
    const c = validateField(emailInput,   'email',   'emailErr');
    const d = validateField(contactInput, 'contact', 'contactErr');
    return a && b && c && d;
  }

  /** Validate the edit modal form fields. */
  function validateEditForm() {
    const a = validateField(editName,    'name',    'editNameErr');
    const b = validateField(editId,      'id',      'editIdErr');
    const c = validateField(editEmail,   'email',   'editEmailErr');
    const d = validateField(editContact, 'contact', 'editContactErr');
    return a && b && c && d;
  }

  /* ──────────────────────────────────────────────
     TOAST NOTIFICATIONS
  ────────────────────────────────────────────── */
  function showToast(msg, isError = false) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.toggle('error-toast', isError);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ──────────────────────────────────────────────
     MODAL OPEN / CLOSE HELPERS
  ────────────────────────────────────────────── */
  function openModal(overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // lock background scroll
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Close modals by clicking the dark backdrop */
  [editModal, deleteModal].forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  /* Close modals with Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(editModal);
      closeModal(deleteModal);
    }
  });

  /* ──────────────────────────────────────────────
     DYNAMIC SCROLLBAR (Task 6 requirement)
     JS adds overflow-y only when rows exceed 5
  ────────────────────────────────────────────── */
  function applyDynamicScrollbar() {
    if (students.length > 5) {
      tableWrap.style.maxHeight = '340px';
      tableWrap.style.overflowY = 'auto';
    } else {
      tableWrap.style.maxHeight = 'none';
      tableWrap.style.overflowY = 'visible';
    }
  }

  /* ──────────────────────────────────────────────
     RENDER TABLE
  ────────────────────────────────────────────── */

  /** Escape HTML special chars to prevent XSS */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Render the students array into the table, with optional search filter. */
  function renderTable() {
    const query    = searchInput.value.toLowerCase().trim();
    const filtered = query
      ? students.filter(s =>
          s.name.toLowerCase().includes(query)  ||
          s.id.includes(query)                  ||
          s.email.toLowerCase().includes(query) ||
          s.contact.includes(query))
      : [...students];

    tableBody.innerHTML            = '';
    emptyState.style.display       = filtered.length === 0 ? 'block' : 'none';
    totalCount.textContent         = students.length;

    filtered.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.classList.add('row-animate');
      tr.dataset.uid = s.uid;

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${escHtml(s.name)}</td>
        <td>${escHtml(s.id)}</td>
        <td>${escHtml(s.email)}</td>
        <td>${escHtml(s.contact)}</td>
        <td>
          <button class="btn-edit" onclick="openEditModal('${s.uid}')">Edit</button>
          <button class="btn-del"  onclick="openDeleteModal('${s.uid}')">Delete</button>
        </td>`;

      tableBody.appendChild(tr);
    });

    applyDynamicScrollbar();
  }

  /* ──────────────────────────────────────────────
     ADD STUDENT
  ────────────────────────────────────────────── */
  addBtn.addEventListener('click', () => {
    /* Prevent completely empty submission */
    if (!nameInput.value && !idInput.value && !emailInput.value && !contactInput.value) {
      showToast('Please fill in all fields before submitting.', true);
      return;
    }

    if (!validateMainForm()) {
      showToast('Please fix the highlighted errors.', true);
      return;
    }

    /* Duplicate Student ID check */
    if (students.some(s => s.id === idInput.value.trim())) {
      showToast('A student with this ID already exists.', true);
      idInput.classList.add('error');
      return;
    }

    students.push({
      uid:     crypto.randomUUID(),
      name:    nameInput.value.trim(),
      id:      idInput.value.trim(),
      email:   emailInput.value.trim(),
      contact: contactInput.value.trim(),
    });

    saveToStorage();
    renderTable();
    clearMainForm();
    showToast('✓ Student registered successfully.');
  });

  /* ──────────────────────────────────────────────
     CLEAR MAIN FORM
  ────────────────────────────────────────────── */
  function clearMainForm() {
    [nameInput, idInput, emailInput, contactInput].forEach(el => {
      el.value = '';
      el.classList.remove('error');
    });
    document.querySelectorAll('#formCard .error-msg').forEach(el => el.classList.remove('show'));
  }

  /* ──────────────────────────────────────────────
     EDIT MODAL — OPEN
  ────────────────────────────────────────────── */
  function openEditModal(uid) {
    const s = students.find(s => s.uid === uid);
    if (!s) return;

    editingUid = uid;

    /* Pre-fill modal inputs with current student data */
    editName.value    = s.name;
    editId.value      = s.id;
    editEmail.value   = s.email;
    editContact.value = s.contact;

    /* Reset any previous validation errors inside the modal */
    [editName, editId, editEmail, editContact].forEach(el => el.classList.remove('error'));
    document.querySelectorAll('#editModal .error-msg').forEach(el => el.classList.remove('show'));

    openModal(editModal);
    setTimeout(() => editName.focus(), 100);
  }

  /* ──────────────────────────────────────────────
     EDIT MODAL — SAVE
  ────────────────────────────────────────────── */
  editSaveBtn.addEventListener('click', () => {
    if (!validateEditForm()) {
      showToast('Please fix the highlighted errors.', true);
      return;
    }

    const idx   = students.findIndex(s => s.uid === editingUid);
    if (idx === -1) return;

    const newId = editId.value.trim();

    /* Duplicate ID check — ignore if ID hasn't changed */
    if (newId !== students[idx].id && students.some(s => s.id === newId)) {
      showToast('A student with this ID already exists.', true);
      editId.classList.add('error');
      return;
    }

    /* Apply updates */
    students[idx] = {
      uid:     editingUid,
      name:    editName.value.trim(),
      id:      newId,
      email:   editEmail.value.trim(),
      contact: editContact.value.trim(),
    };

    saveToStorage();
    renderTable();
    closeModal(editModal);
    showToast('✓ Student record updated.');
    editingUid = null;
  });

  /* Close edit modal */
  editModalClose.addEventListener('click', () => closeModal(editModal));
  editCancelBtn.addEventListener('click',  () => closeModal(editModal));

  /* Live validation inside edit modal */
  editName.addEventListener('input',    () => validateField(editName,    'name',    'editNameErr'));
  editId.addEventListener('input',      () => validateField(editId,      'id',      'editIdErr'));
  editEmail.addEventListener('input',   () => validateField(editEmail,   'email',   'editEmailErr'));
  editContact.addEventListener('input', () => validateField(editContact, 'contact', 'editContactErr'));

  /* Key filters for edit modal inputs */
  editId.addEventListener('keypress',      e => { if (!/\d/.test(e.key))          e.preventDefault(); });
  editContact.addEventListener('keypress', e => { if (!/\d/.test(e.key))          e.preventDefault(); });
  editName.addEventListener('keypress',    e => { if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault(); });

  /* ──────────────────────────────────────────────
     DELETE MODAL — OPEN
  ────────────────────────────────────────────── */
  function openDeleteModal(uid) {
    const s = students.find(s => s.uid === uid);
    if (!s) return;

    pendingDelUid = uid;
    deleteStudentName.textContent = s.name;  // show name in the modal body
    openModal(deleteModal);
  }

  /* ──────────────────────────────────────────────
     DELETE MODAL — CONFIRM
  ────────────────────────────────────────────── */
  deleteConfirmBtn.addEventListener('click', () => {
    if (!pendingDelUid) return;

    students    = students.filter(s => s.uid !== pendingDelUid);
    pendingDelUid = null;

    saveToStorage();
    renderTable();
    closeModal(deleteModal);
    showToast('Record deleted successfully.');
  });

  /* Close delete modal */
  deleteModalClose.addEventListener('click', () => { closeModal(deleteModal); pendingDelUid = null; });
  deleteCancelBtn.addEventListener('click',  () => { closeModal(deleteModal); pendingDelUid = null; });

  /* ──────────────────────────────────────────────
     MAIN FORM — LIVE VALIDATION & KEY FILTERS
  ────────────────────────────────────────────── */
  nameInput.addEventListener('input',    () => validateField(nameInput,    'name',    'nameErr'));
  idInput.addEventListener('input',      () => validateField(idInput,      'id',      'idErr'));
  emailInput.addEventListener('input',   () => validateField(emailInput,   'email',   'emailErr'));
  contactInput.addEventListener('input', () => validateField(contactInput, 'contact', 'contactErr'));

  idInput.addEventListener('keypress',      e => { if (!/\d/.test(e.key))          e.preventDefault(); });
  contactInput.addEventListener('keypress', e => { if (!/\d/.test(e.key))          e.preventDefault(); });
  nameInput.addEventListener('keypress',    e => { if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault(); });

  /* ──────────────────────────────────────────────
     SEARCH
  ────────────────────────────────────────────── */
  searchInput.addEventListener('input', renderTable);

  /* ──────────────────────────────────────────────
     INIT — load data and render on page load
  ────────────────────────────────────────────── */
  loadFromStorage();
  renderTable();
