import { db } from '/JS/firebase-config.js';
import { ref, get, update, remove } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#objects .card-container');
  const pagination = document.getElementById('pagination');
  const uploadPage = document.getElementById('objects');
  const itemsPerPage = 6;
  let currentPage = 1;
  let allParts = [];

  async function loadObjects() {
    try {
      const snapshot = await get(ref(db, 'Parts'));
      if (snapshot.exists()) {
        allParts = Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...value }));
        renderPage(currentPage);
        renderPagination();
      } else {
        container.innerHTML = '<p>No uploaded objects found.</p>';
      }
    } catch (err) {
      console.error('Error loading parts:', err);
      container.innerHTML = '<p>Error loading objects.</p>';
    }
  }

  function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const partsToDisplay = allParts.slice(start, end);

    container.innerHTML = partsToDisplay.map((part, index) => `
      <button class="card" data-index="${start + index}">
        <img src="${part.image_url || 'placeholder.jpg'}" alt="${part.part_name}" />
        <h3>${part.part_name}</h3>
        <small>${new Date(part.date_modified).toLocaleString()}</small>
      </button>
    `).join('');

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const part = allParts[card.dataset.index];
        openModal(part);
      });
    });
  }

  function renderPagination() {
    const totalPages = Math.ceil(allParts.length / itemsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.disabled = true;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage(currentPage);
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }

  function openModal(part) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div class="modal-body">
          <label>Engine Name:</label>
          <input type="text" id="partName" value="${part.part_name}" disabled />

          <label>Image URL:</label>
          <input type="text" id="imageUrl" value="${part.image_url || ''}" disabled />

          <label>Date Modified:</label>
          <input type="text" id="dateModified" value="${new Date(part.date_modified).toLocaleString()}" disabled />

          <div class="modal-actions">

            <button id="deleteBtn">Delete</button>
            <button id="updateBtn" style="display:none;">Update</button>
            <button id="cancelBtn" style="display:none;">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-button').onclick = () => modal.remove();

    const partNameInput = modal.querySelector('#partName');
    // const partTypeInput = modal.querySelector('#partType');
    const imageUrlInput = modal.querySelector('#imageUrl');

    // const editBtn = modal.querySelector('#editBtn');
    const deleteBtn = modal.querySelector('#deleteBtn');
    const updateBtn = modal.querySelector('#updateBtn');
    const cancelBtn = modal.querySelector('#cancelBtn');

    // editBtn.onclick = () => {
    //   partNameInput.disabled = false;
    //   // partTypeInput.disabled = false;
    //   imageUrlInput.disabled = false;

    //   editBtn.style.display = 'none';
    //   deleteBtn.style.display = 'none';
    //   updateBtn.style.display = 'inline-block';
    //   cancelBtn.style.display = 'inline-block';
    // };

    cancelBtn.onclick = () => {
      modal.remove();
      openModal(part); // reload original values
    };

    updateBtn.onclick = async () => {
      const updatedDate = new Date().toISOString();
      const updatedPart = {
        part_name: partNameInput.value,
        // part_type: partTypeInput.value,
        image_url: imageUrlInput.value,
        date_modified: updatedDate
      };

      try {
        await update(ref(db, `Parts/${part.id}`), updatedPart);
        showConfirmationModal('success', 'Part updated successfully!');
        modal.remove();
        loadObjects();
      } catch (err) {
        console.error('Update failed:', err);
        showConfirmationModal('error', 'Failed to update part.');
      }
    };

    deleteBtn.onclick = () => {
      const confirmModal = document.createElement('div');
      confirmModal.innerHTML = `
        <div id="deleteConfirmModal" style="
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        ">
          <div style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            max-width: 300px;
          ">
            <h3 style="color: #dc3545">Confirm Delete</h3>
            <p>Are you sure you want to delete this Engine?</p>
            <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
              <button id="confirmDeleteBtn" style="
                background-color: #dc3545;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              ">Yes</button>
              <button id="cancelDeleteBtn" style="
                background-color: #6c757d;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              ">Cancel</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(confirmModal);

      document.getElementById('cancelDeleteBtn').onclick = () => {
        document.getElementById('deleteConfirmModal').remove();
      };

      document.getElementById('confirmDeleteBtn').onclick = async () => {
        try {
          await remove(ref(db, `Parts/${part.id}`));
          document.getElementById('deleteConfirmModal').remove();
          modal.remove();
          showConfirmationModal('success', 'Part deleted successfully!');
          loadObjects();
        } catch (err) {
          console.error('Delete failed:', err);
          showConfirmationModal('error', 'Failed to delete part.');
        }
      };
    };
  }

  function showConfirmationModal(type, message) {
    const isSuccess = type === 'success';
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div id="confirmationModal" style="
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          max-width: 300px;
        ">
          <h3 style="color: ${isSuccess ? '#28a745' : '#dc3545'}">
            ${isSuccess ? 'Success' : 'Error'}
          </h3>
          <p>${message}</p>
          <button id="closeModalBtn" style="
            margin-top: 10px;
            background-color: ${isSuccess ? '#6f42c1' : '#dc3545'};
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeModalBtn').addEventListener('click', () => {
      document.getElementById('confirmationModal').remove();
    });
  }

  const formTarget = document.getElementById('uploadFormContainer');
  if (formTarget) {
    fetch('/Partial/asset-form.html')
      .then(res => res.text())
      .then(html => {
        formTarget.innerHTML = html;
      });
  }

  window.loadObjects = loadObjects;
  loadObjects();
});
