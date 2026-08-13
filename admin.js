import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const CLOUD_NAME = "ycyleyq2";
const UPLOAD_PRESET = "beo_gallery";

window.adminLogin = function () {

    const username = prompt("Enter Username");
    const password = prompt("Enter Password");

    if (username !== "admin" || password !== "1234") {
        alert("Invalid Username or Password");
        return;
    }

    document.getElementById("content").innerHTML = `

<h2>Admin Panel</h2>

<div class="admin-box">
<hr>

<h3>🏫 School Data Import</h3>

<p>
  Government + Aided School Excel upload
</p>

<input
  type="file"
  id="schoolExcelFile"
  accept=".xlsx,.xls"
/>

<br><br>

<button onclick="importSchoolsExcel()">
  📥 Import School Excel
</button>

<p id="schoolImportStatus"></p>
<h3>Gallery Upload</h3>

<input type="text" id="galleryTitle" placeholder="Image Title"><br><br>

<input type="file" id="galleryFile" accept="image/*"><br><br>

<button onclick="uploadGallery()">Upload Gallery</button>
<button onclick="showGalleryAdmin()">
    🖼 Manage Gallery
</button>
<hr>

<h3>📢 Circular Upload</h3>

<input type="text" id="circularTitle" placeholder="Circular Title">
<br><br>

<select id="circularCategory">
    <option value="">Select Circular Category</option>
    <option value="Department">🏛️ Department Circulars</option>
    <option value="School Education">🏫 School Education Circulars</option>
    <option value="Teacher Related">👨‍🏫 Teacher Related Circulars</option>
    <option value="Academic">📚 Academic Circulars</option>
    <option value="Financial">💰 Financial / Grants Circulars</option>
    <option value="Examination">📝 Examination Circulars</option>
    <option value="General">📅 General Circulars</option>
</select>
<br><br>

<input type="file" id="circularFile" accept=".pdf">
<br><br>

<button onclick="uploadCircular()">Upload Circular</button>

</div>
<button onclick="showManageCirculars()">
    📑 Manage Circulars
</button>
`;

};
window.uploadGallery = async function () {
    const file = document.getElementById("galleryFile").files[0];
    const title = document.getElementById("galleryTitle").value;

    if (!file || !title) {
        alert("Please select image and enter title.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        await addDoc(collection(db, "gallery"), {
            title: title,
            image: data.secure_url,
            createdAt: new Date().toISOString()
        });

        alert("✅ Gallery uploaded successfully!");

        document.getElementById("galleryTitle").value = "";
        document.getElementById("galleryFile").value = "";

    } catch (err) {

        console.error(err);
        alert("❌ Upload failed.");

    }

};
window.uploadCircular = async function () {

    const file = document.getElementById("circularFile").files[0];
    const title = document.getElementById("circularTitle").value;
const category = document.getElementById("circularCategory").value;
   if (!file || !title || !category) {
    alert("Please select PDF, enter title and select category.");
    return;
}

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        await addDoc(collection(db, "circulars"), {
    category: category,
    title: title,
    pdf: data.secure_url,
    createdAt: new Date().toISOString()
});

        alert("✅ Circular uploaded successfully!");

        document.getElementById("circularTitle").value = "";
        document.getElementById("circularFile").value = "";

    } catch (err) {
        console.error(err);
        alert("❌ Circular upload failed.");
    }

};
window.showGalleryAdmin = async function () {

    const snapshot = await getDocs(collection(db, "gallery"));

    let html = "<h3>🖼 Manage Gallery</h3>";

    snapshot.forEach((item) => {

        const data = item.data();

        html += `
            <div class="gallery-card">
                <img src="${data.image}" width="200">
                <h4>${data.title}</h4>

                <button onclick="deleteGallery('${item.id}')">
                    🗑 Delete
                </button>

                <hr>
            </div>
        `;

    });

    document.getElementById("content").innerHTML = html;

};
window.deleteGallery = async function (id) {

    const ok = confirm("Are you sure you want to delete this image?");

    if (!ok) return;

    try {

        await deleteDoc(doc(db, "gallery", id));

        alert("✅ Gallery deleted successfully.");

        showGalleryAdmin();

    } catch (err) {

        console.error(err);

        alert("❌ Delete failed.");

    }

};
window.showManageCirculars = async function () {

    const snapshot = await getDocs(collection(db, "circulars"));

    let html = "<h3>📑 Manage Circulars</h3>";

    snapshot.forEach((item) => {

        const data = item.data();

        html += `
            <div class="gallery-card">

                <h3>${data.title}</h3>

                <a href="${data.pdf}" target="_blank">
                    📄 Open PDF
                </a>

                <br><br>

                <button onclick="deleteCircular('${item.id}')">
                    🗑 Delete
                </button>

                <hr>

            </div>
        `;

    });

    document.getElementById("content").innerHTML = html;

};
window.deleteCircular = async function(id) {
   console.log("DELETE ID:", id); 
    const ok = confirm("Are you sure you want to delete this circular?");
    if (!ok) return;

    try {
        await deleteDoc(doc(db, "circulars", id));

        alert("✅ Circular deleted successfully!");

        window.showManageCirculars();

    } catch (error) {
        console.error("Delete Circular Error:", error);
        alert("❌ Circular delete failed: " + error.message);
    }
};

window.importSchoolsExcel = async function () {

  const file =
    document.getElementById("schoolExcelFile").files[0];

  const status =
    document.getElementById("schoolImportStatus");

  if (!file) {
    alert("Please select School Excel file.");
    return;
  }

  status.innerHTML = "⏳ Reading Excel...";

  try {

    // Load Excel library
    if (!window.XLSX) {

      await new Promise((resolve, reject) => {

        const script =
          document.createElement("script");

        script.src =
          "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

      });

    }


    const arrayBuffer =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(arrayBuffer, {
        type: "array"
      });


    const sheetName =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[sheetName];


    const rows =
      XLSX.utils.sheet_to_json(worksheet);


    if (!rows.length) {

      status.innerHTML =
        "❌ Excel is empty.";

      return;
    }


    status.innerHTML =
      `⏳ ${rows.length} schools found. Uploading...`;


    // Firestore maximum batch = 500
    const batch = writeBatch(db);


    rows.forEach((row) => {

      const schoolRef =
        doc(collection(db, "schools"));


      batch.set(schoolRef, {

        cluster:
          String(row["CLUSTER NAME"] || "").trim(),

        schoolName:
          String(row["SCHOOL NAME"] || "").trim(),

        diseNumber:
          String(row["DISE NUMBER"] || "").trim(),

        type:
          String(row["TYPE"] || "").trim(),

        management:
          String(row["MANAGEMENT"] || "").trim(),

        teacherPdf: ""

      });

    });


    await batch.commit();


    status.innerHTML =
      `✅ ${rows.length} school records imported successfully!`;

    alert(
      `✅ ${rows.length} schools imported successfully.`
    );


  } catch (error) {

    console.error(
      "School Import Error:",
      error
    );

    status.innerHTML =
      `❌ Import failed: ${error.message}`;

    alert(
      "❌ Import failed: " +
      error.message
    );

  }

};
