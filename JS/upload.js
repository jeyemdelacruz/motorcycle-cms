import { db } from './firebase-config.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";
// const storage = getStorage();

const uploadPage = document.querySelector('#upload');
if (uploadPage) {
  fetch('/Partial/upload-form.html')
    .then(res => res.text())
    .then(html => {
      uploadPage.innerHTML = html;

      requestAnimationFrame(() => {
        const uploadForm = document.getElementById('uploadForm');
        const partNameInput = document.getElementById('partName');
        const partTypeInput = document.getElementById('partType');
        const partImageInput = document.getElementById('partImage');
        const partModelInput = document.getElementById('fbxFile');
        const uploadBtn = document.getElementById('uploadBtn');

        uploadBtn.addEventListener('mousedown', () => {
          uploadBtn.style.backgroundColor = '#4CAF50';
        });

        uploadBtn.addEventListener('mouseup', () => {
          setTimeout(() => {
            uploadBtn.style.backgroundColor = '#6f42c1';
          }, 300);
        });

        uploadForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          uploadBtn.disabled = true;
          uploadBtn.textContent = 'Uploading...';

          const partName = partNameInput.value;
          const partType = partTypeInput.value;
          const uuid = generateUUID();
          const timestamp = new Date().toISOString();
          // const image = partImageInput.files[0];
          // const model = partModelInput.files[0];


          // if (!image) return;

          // const imageRef = storageRef(storage, uuid);



          const newPart = {
            uuid : uuid,
            part_name: partName,
            part_type: partType,
            date_created: timestamp,
            date_modified: timestamp,
            image_url: "",
            model_url: ""
          };

          try {
             // await uploadBytes(imageRef, image);
            // const downloadURL = await getDownloadURL(imageRef);
            const partsRef = ref(db, 'Parts');
            await push(partsRef, newPart);
            showSuccessModal();
          } catch (err) {
            console.error('Upload failed:', err);
            alert("Upload failed. Check console for details.");
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload';
          }
        });
      });
    });
}

function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function showSuccessModal() {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div id="uploadModal" style="
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
        <h3>Upload Complete</h3>
        <p>Your part has been successfully uploaded.</p>
        <button id="closeModalBtn" style="
          margin-top: 10px;
          background-color: #6f42c1;
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
    document.getElementById('uploadModal').remove();
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Upload';
    document.getElementById('uploadForm').reset();
  });
}
