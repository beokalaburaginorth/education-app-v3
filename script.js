import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

function setContent(html) {
  document.getElementById("content").innerHTML = html;
}


// =======================
// LOAD CHART.JS
// =======================

function loadChartJS() {
  return new Promise((resolve, reject) => {

    if (window.Chart) {
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/chart.js";

    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

// =======================
// PROFESSIONAL HOME DASHBOARD
// =======================

window.showHome = async function () {

  try {

    const schoolsSnap = await getDocs(
    collection(db, "schools")
);

let stats = {
  govtSchools: 0,
  aidedSchools: 0,
  
    govtPrimarySchools: 0,
    govtHighSchools: 0,
    aidedPrimarySchools: 0,
    aidedHighSchools: 0,

    govtPrimaryTeachers: 0,
    govtHighTeachers: 0,
    aidedPrimaryTeachers: 0,
    aidedHighTeachers: 0
};

schoolsSnap.forEach((docSnap) => {

    const data = docSnap.data();

    const type = String(
        data.TYPE ||
        data.type ||
        data["TYPE"] ||
        ""
    ).trim().toUpperCase();

    const management = String(
        data.MANAGEMENT ||
        data.management ||
        data["MANAGEMENT"] ||
        ""
    ).trim().toUpperCase();


    // ==============================
    // GOVERNMENT SCHOOLS
    // ==============================

    if (
        management === "GOVERNMENT" &&
        (type === "GHPS" || type === "LPS")
    ) {
        stats.govtPrimarySchools++;
    }

    if (
        management === "GOVERNMENT" &&
        type === "GHS"
    ) {
        stats.govtHighSchools++;
    }


    // ==============================
    // AIDED SCHOOLS
    // ==============================

    if (
        management === "AIDED" &&
        type === "AIDED HPS"
    ) {
        stats.aidedPrimarySchools++;
    }

    if (
        management === "AIDED" &&
        type === "AIDED HS"
    ) {
        stats.aidedHighSchools++;
    }

});
// TOTAL GOVERNMENT & AIDED SCHOOLS
stats.govtSchools =
    stats.govtPrimarySchools + stats.govtHighSchools;

stats.aidedSchools =
    stats.aidedPrimarySchools + stats.aidedHighSchools;


    // =======================
    // TOTALS
    // =======================

   const totalSchools = schoolsSnap.size;


    const totalTeachers =
      Number(stats.govtPrimaryTeachers) +
      Number(stats.govtHighTeachers) +
      Number(stats.aidedPrimaryTeachers) +
      Number(stats.aidedHighTeachers);


    // =======================
    // DASHBOARD HTML
    // =======================

    setContent(`

      <div class="dashboard-home">

        <div class="welcome-box">

          <div>

            <h2>🏫 BEO Kalaburagi North</h2>

            <p>
              Education Department Dashboard
            </p>

          </div>

          <div class="welcome-icon">
            📚
          </div>

        </div>


        <!-- SUMMARY CARDS -->

        <div class="summary-grid">

          <div class="summary-card school-total">

            <div class="summary-icon">
              🏫
            </div>

            <div>

              <span>Total Schools</span>

              <strong>${totalSchools}</strong>

            </div>

          </div>


          <div class="summary-card teacher-total">

            <div class="summary-icon">
              👨‍🏫
            </div>

            <div>

              <span>Total Teachers</span>

              <strong>${totalTeachers}</strong>

            </div>

          </div>


          <div class="summary-card govt-total">

            <div class="summary-icon">
              🏛️
            </div>

            <div>

              <span>Government Schools</span>

              <strong>
               ${stats.govtSchools}
              </strong>

            </div>

          </div>


          <div class="summary-card aided-total">

            <div class="summary-icon">
              🏢
            </div>

            <div>

              <span>Aided Schools</span>

              <strong>
               ${stats.aidedSchools}
              </strong>

            </div>

          </div>

        </div>


        <!-- CHARTS -->

        <div class="charts-grid">


          <div class="chart-card">

            <h3>📊 School Distribution</h3>

            <div class="chart-box">

              <canvas id="schoolPieChart"></canvas>

            </div>

          </div>


          <div class="chart-card">

            <h3>👨‍🏫 Teacher Distribution</h3>

            <div class="chart-box">

              <canvas id="teacherBarChart"></canvas>

            </div>

          </div>


        </div>


        <!-- SCHOOL DETAILS -->

        <h2 class="section-title">
          🏫 School Details
        </h2>


        <div class="detail-grid">


          <div class="detail-card">

            <span>🏫</span>

            <div>

              <h4>Govt Primary Schools</h4>

              <strong>${stats.govtPrimarySchools}</strong>

            </div>

          </div>


          <div class="detail-card">

            <span>🏫</span>

            <div>

              <h4>Govt High Schools</h4>

              <strong>${stats.govtHighSchools}</strong>

            </div>

          </div>


          <div class="detail-card">

            <span>🏢</span>

            <div>

              <h4>Aided Primary Schools</h4>

              <strong>${stats.aidedPrimarySchools}</strong>

            </div>

          </div>


          <div class="detail-card">

            <span>🏢</span>

            <div>

              <h4>Aided High Schools</h4>

              <strong>${stats.aidedHighSchools}</strong>

            </div>

          </div>


        </div>


        <!-- TEACHER DETAILS -->

        <h2 class="section-title">
          👨‍🏫 Teacher Details
        </h2>


        <div class="detail-grid">


          <div class="detail-card">

            <span>👨‍🏫</span>

            <div>

              <h4>Govt Primary Teachers</h4>

              <strong>${stats.govtPrimaryTeachers}</strong>

            </div>

          </div>


          <div class="detail-card">

            <span>👨‍🏫</span>

            <div>

              <h4>Govt High School Teachers</h4>

              <strong>${stats.govtHighTeachers}</strong>

            </div>

          </div>


          <div class="detail-card">

            <span>👨‍🏫</span>

            <div>

              <h4>Aided Primary Teachers</h4>

              <strong>${stats.aidedPrimaryTeachers}</strong>

            </div>

          </div>


          <div class="detail-card">

            <span>👨‍🏫</span>

            <div>

              <h4>Aided High School Teachers</h4>

              <strong>${stats.aidedHighTeachers}</strong>

            </div>

          </div>


        </div>

      </div>

    `);


    // =======================
    // CHART.JS
    // =======================

    await loadChartJS();


    // =======================
    // SCHOOL DOUGHNUT
    // =======================

    new Chart(
      document.getElementById("schoolPieChart"),
      {

        type: "doughnut",

        data: {

          labels: [
            "Govt Primary",
            "Govt High",
            "Aided Primary",
            "Aided High"
          ],

          datasets: [{

            data: [

              Number(stats.govtPrimarySchools) || 0,
              Number(stats.govtHighSchools) || 0,
              Number(stats.aidedPrimarySchools) || 0,
              Number(stats.aidedHighSchools) || 0

            ],

            borderWidth: 2

          }]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

         plugins: {
    legend: {
        position: "bottom",
        labels: {
            font: {
                size: 22,
                weight: "bold"
            }
        }
    }
}
}});


    // =======================
    // TEACHER BAR CHART
    // =======================

    new Chart(
      document.getElementById("teacherBarChart"),
      {

        type: "bar",

        data: {

          labels: [

            "Govt Primary",
            "Govt High",
            "Aided Primary",
            "Aided High"

          ],

          datasets: [{

            label: "Teachers",

            data: [

              Number(stats.govtPrimaryTeachers) || 0,
              Number(stats.govtHighTeachers) || 0,
              Number(stats.aidedPrimaryTeachers) || 0,
              Number(stats.aidedHighTeachers) || 0

            ],

            borderWidth: 1

          }]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            y: {

              beginAtZero: true

            }

          },

          plugins: {

            legend: {

              display: false

            }

          }

        }

      }
    );


  } catch (error) {

    console.error("Dashboard Error:", error);

    setContent(`

      <div class="card">

        <h2>❌ Dashboard Error</h2>

        <p>${error.message}</p>

      </div>

    `);

  }

};


// =======================
// GALLERY
// =======================

window.showGallery = async function () {

    setContent(`
        <h2>🖼️ Gallery</h2>
        <p>Loading gallery...</p>
    `);

    try {

        const galleryRef = collection(db, "gallery");
        const snapshot = await getDocs(galleryRef);

        let html = `
            <h2>🖼️ Gallery</h2>
            <div class="dashboard">
        `;

        if (snapshot.empty) {

            html += `
                <div class="card">
                    <h3>No Gallery Images</h3>
                    <p>Gallery is empty.</p>
                </div>
            `;

        } else {

            window.galleryItems = [];

            snapshot.forEach((docSnap) => {

                const data = docSnap.data();

                const imageUrl =
                    data.imageUrl ||
                    data.imageURL ||
                    data.url ||
                    data.photo ||
                    data.image ||
                    "";

                const title =
                    data.title ||
                    data.name ||
                    "Gallery Image";

                if (imageUrl) {

                    window.galleryItems.push({
                        imageUrl: imageUrl,
                        title: title
                    });

                    const index =
                        window.galleryItems.length - 1;

                    html += `
                        <div class="card">

                            <img
                                src="${imageUrl}"
                                alt="${title}"
                                style="
                                    width:100%;
                                    max-width:500px;
                                    border-radius:10px;
                                    display:block;
                                    margin:auto;
                                    cursor:pointer;
                                "
                                onclick="openGallery(${index})"
                            >

                            <h3>${title}</h3>

                        </div>
                    `;
                }

            });
        }

        html += `</div>`;

        setContent(html);

    } catch (error) {

        console.error("Gallery Error:", error);

        setContent(`
            <div class="card">
                <h3 style="color:red;">❌ Gallery Error</h3>
                <p>${error.message}</p>
            </div>
        `);
    }
};
window.openGallery = function(index) {

    const item = window.galleryItems[index];

    if (!item) return;

    const modal = document.createElement("div");

    modal.id = "galleryModal";

    modal.style = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.95);
        z-index:99999;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        padding:20px;
    `;

    modal.innerHTML = `

        <button
            onclick="closeGallery()"
            style="
                position:absolute;
                top:20px;
                right:25px;
                font-size:30px;
                background:red;
                color:white;
                border:none;
                border-radius:50%;
                width:50px;
                height:50px;
                cursor:pointer;
            "
        >×</button>

        <button
            onclick="previousGallery()"
            style="
                position:absolute;
                left:20px;
                font-size:40px;
                background:#1976d2;
                color:white;
                border:none;
                border-radius:50%;
                width:55px;
                height:55px;
                cursor:pointer;
            "
        >‹</button>

        <img
            id="galleryFullImage"
            src="${item.imageUrl}"
            alt="${item.title}"
            style="
                max-width:90%;
                max-height:75vh;
                object-fit:contain;
                border-radius:10px;
                transition:transform 0.3s;
            "
        >

        <button
            onclick="nextGallery()"
            style="
                position:absolute;
                right:20px;
                font-size:40px;
                background:#1976d2;
                color:white;
                border:none;
                border-radius:50%;
                width:55px;
                height:55px;
                cursor:pointer;
            "
        >›</button>

        <h3
            id="galleryFullTitle"
            style="
                color:white;
                margin-top:15px;
                text-align:center;
            "
        >${item.title}</h3>

        <button
            onclick="zoomGallery()"
            style="
                margin-top:10px;
                padding:10px 20px;
                background:white;
                color:#111;
                border:none;
                border-radius:8px;
                cursor:pointer;
            "
        >🔍 Zoom</button>
    `;

    document.body.appendChild(modal);

    window.currentGalleryIndex = index;
    window.galleryZoom = 1;
};


window.closeGallery = function() {

    const modal = document.getElementById("galleryModal");

    if (modal) {
        modal.remove();
    }
};


window.nextGallery = function() {

    if (!window.galleryItems?.length) return;

    window.currentGalleryIndex++;

    if (
        window.currentGalleryIndex >=
        window.galleryItems.length
    ) {
        window.currentGalleryIndex = 0;
    }

    updateGalleryImage();
};


window.previousGallery = function() {

    if (!window.galleryItems?.length) return;

    window.currentGalleryIndex--;

    if (window.currentGalleryIndex < 0) {

        window.currentGalleryIndex =
            window.galleryItems.length - 1;
    }

    updateGalleryImage();
};


window.updateGalleryImage = function() {

    const item =
        window.galleryItems[window.currentGalleryIndex];

    if (!item) return;

    const image =
        document.getElementById("galleryFullImage");

    const title =
        document.getElementById("galleryFullTitle");

    if (image) {
        image.src = item.imageUrl;
        image.style.transform = "scale(1)";
    }

    if (title) {
        title.textContent = item.title;
    }

    window.galleryZoom = 1;
};


window.zoomGallery = function() {

    const image =
        document.getElementById("galleryFullImage");

    if (!image) return;

    window.galleryZoom += 0.25;

    if (window.galleryZoom > 2) {
        window.galleryZoom = 1;
    }

    image.style.transform =
        `scale(${window.galleryZoom})`;
};

// =======================
// CIRCULAR
// =======================

window.showCirculars = async function () {

  setContent(`
    <h2>📢 Circulars</h2>
    <p>Loading circulars...</p>
  `);

  try {

    console.log("Circular loading started");

    const circularRef = collection(db, "circulars");

    const snapshot = await getDocs(circularRef);

    console.log("Circular documents:", snapshot.size);

    let html = `
      <h2>📢 Circulars</h2>
    `;

    if (snapshot.empty) {

      html += `
        <div class="card">
          <h3>No Circulars Found</h3>
          <p>Firestore circulars collection is empty.</p>
        </div>
      `;

    } else {

      snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        const title =
          data.title ||
          data.name ||
          data.subject ||
          "Circular";

        const pdfUrl =
          data.pdf ||
          data.pdfUrl ||
          data.pdfURL ||
          data.fileUrl ||
          data.url;

        html += `
          <div class="card">

            <h3>📄 ${title}</h3>

            ${
              pdfUrl
                ? `
                  <a
                    href="${pdfUrl}"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:10px 20px;
                      background:#1976d2;
                      color:white;
                      border-radius:6px;
                      text-decoration:none;
                    "
                  >
                    📄 View Circular
                  </a>
                `
                : `
                  <p>PDF link not found</p>
                `
            }

          </div>
        `;

      });
    }

    setContent(html);

  } catch (error) {

    console.error("CIRCULAR ERROR:", error);

    setContent(`
      <h2>📢 Circulars</h2>

      <div class="card">

        <h3>❌ Circular loading error</h3>

        <p>${error.message}</p>

      </div>
    `);
  }
};
// ======================================
// STEP 4 - SCHOOL SELECTOR
// Cluster → Government / Aided → School
// ======================================
window.toggleSchoolSideMenu = function(open) {
    const side = document.getElementById("schoolSideMenu");

    if (!side) return;

    side.style.display = open ? "block" : "none";
    side.setAttribute("aria-hidden", open ? "false" : "true");
};
window.showSchoolSelector = async function () {
toggleSchoolSideMenu(false);
  setContent(`
    <h2>🏫 School Information</h2>

    <div class="card">

      <label><b>Select Cluster</b></label>
      <select id="clusterSelect" onchange="loadSchoolsByCluster()">
        <option value="">-- Select Cluster --</option>
      </select>

      <br><br>

      <label><b>Government Schools</b></label>
      <select id="govtSchoolSelect" onchange="showSelectedSchool(this.value)">
        <option value="">-- Select Government School --</option>
      </select>

      <br><br>

      <label><b>Aided Schools</b></label>
      <select id="aidedSchoolSelect">
        <option value="">-- Select Aided School --</option>
      </select>

      <br><br>

      <div id="schoolInfo"></div>

    </div>
  `);

  try {

    const snapshot = await getDocs(collection(db, "schools"));

    const clusters = new Set();

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      const cluster =
        data.clusterName ||
        data.cluster ||
        data["CLUSTER NAME"] ||
        data["Cluster Name"] ||
        data.CLUSTER ||
        "";

      if (cluster) {
        clusters.add(String(cluster).trim());
      }
    });

    const clusterSelect =
      document.getElementById("clusterSelect");

    [...clusters]
      .sort()
      .forEach((cluster) => {

        const option = document.createElement("option");

        option.value = cluster;
        option.textContent = cluster;

        clusterSelect.appendChild(option);
      });

  } catch (error) {

    console.error("School loading error:", error);

    document.getElementById("schoolInfo").innerHTML =
      `<p style="color:red;">School data loading error: ${error.message}</p>`;
  }
};


// ======================================
// LOAD SCHOOLS AFTER CLUSTER SELECTION
// ======================================

window.loadSchoolsByCluster = async function () {

  const selectedCluster =
    document.getElementById("clusterSelect").value;

  const govtSelect =
    document.getElementById("govtSchoolSelect");

  const aidedSelect =
    document.getElementById("aidedSchoolSelect");

  govtSelect.innerHTML =
    `<option value="">-- Select Government School --</option>`;

  aidedSelect.innerHTML =
    `<option value="">-- Select Aided School --</option>`;

  if (!selectedCluster) return;

  try {

    const snapshot = await getDocs(
      collection(db, "schools")
    );

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      const cluster =
        data.clusterName ||
        data.cluster ||
        data["CLUSTER NAME"] ||
        data["Cluster Name"] ||
        data.CLUSTER ||
        "";

      if (
        String(cluster).trim().toLowerCase() !==
        selectedCluster.trim().toLowerCase()
      ) {
        return;
      }

      const schoolName =
        data.schoolName ||
        data.school ||
        data["SCHOOL NAME"] ||
        data["School Name"] ||
        data.name ||
        "";

      const management =
        data.management ||
        data.schoolType ||
        data.type ||
        data["MANAGEMENT"] ||
        data["Management"] ||
        data["SCHOOL TYPE"] ||
        "";

      if (!schoolName) return;

      const option = document.createElement("option");

      option.value = docSnap.id;
      option.textContent = schoolName;

      const managementText =
        String(management).toLowerCase();

      if (
        managementText.includes("aided")
      ) {

        aidedSelect.appendChild(option);

      } else {

        govtSelect.appendChild(option);
      }

    });

  } catch (error) {

    console.error("School filter error:", error);

    document.getElementById("schoolInfo").innerHTML =
      `<p style="color:red;">
        School loading error: ${error.message}
      </p>`;
  }
};
// ======================================
// STEP 4C - SCHOOL SELECT → TEACHER PDF
// ======================================

window.showSelectedSchool = async function (schoolId) {

  if (!schoolId) {
    document.getElementById("schoolInfo").innerHTML = "";
    return;
  }

  try {

    const schoolRef = doc(db, "schools", schoolId);
    const schoolSnap = await getDoc(schoolRef);

    if (!schoolSnap.exists()) {
      document.getElementById("schoolInfo").innerHTML =
        `<p style="color:red;">School data not found.</p>`;
      return;
    }

    const data = schoolSnap.data();

    const schoolName =
      data.schoolName ||
      data.school ||
      data["SCHOOL NAME"] ||
      data["School Name"] ||
      data.name ||
      "School";

    const teacherPdf =
      data.teacherPdf ||
      data.teacherPDF ||
      data.teacherPdfUrl ||
      data.teacherPDFUrl ||
      data.teacherPdfLink ||
      data.teacherPdfURL ||
      "";

    let html = `
      <div class="card" style="margin-top:20px;">
        <h3>🏫 ${schoolName}</h3>
    `;

  html += `
<div style="
    background:#ffffff;
    padding:12px 16px;
    margin-top:10px;
    border-radius:6px;
    display:flex;
    align-items:center;
    justify-content:space-between;
">
    <b style="color:#0047a1;">
        👨‍🏫 ${schoolName} - Teacher List
    </b>

    <button
        onclick="alert('Teacher data is not available yet for this school.')"
        style="
            background:#0047a1;
            color:white;
            border:none;
            padding:9px 16px;
            border-radius:6px;
            cursor:pointer;
            font-weight:bold;
        "
    >
        👨‍🏫 Teacher List
    </button>
</div>
</div>
`;
html += `
<div style="
    margin-top:12px;
    background:#f5f5f5;
    border:1px solid #ddd;
    border-radius:8px;
    padding:15px;
">
    <h3 style="color:#0047a1;">
        👨‍🏫 Related Teachers
    </h3>

    <p style="color:#777;text-align:center;">
        Teacher data not available yet.
    </p>
</div>
`;

    html += `</div>`;

    document.getElementById("diseSearchResult").innerHTML = html;
  } catch (error) {

    console.error("Teacher PDF Error:", error);

  document.getElementById("diseSearchResult").innerHTML = 
      `<p style="color:red;">
        Error: ${error.message}
      </p>`;
  }
};
// ======================================
// TEACHER PDF MODAL
// ======================================

window.showTeacherPDFModal = function (pdfUrl, schoolName) {

  if (!pdfUrl) {
    alert("Teacher PDF is not available for this school.");
    return;
  }

  const oldModal = document.getElementById("teacherPdfModal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");

  modal.id = "teacherPdfModal";

  modal.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.75);
      z-index:9999;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:15px;
    ">

      <div style="
        width:95%;
        height:90%;
        max-width:1000px;
        background:white;
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 5px 30px rgba(0,0,0,0.4);
        display:flex;
        flex-direction:column;
      ">

        <div style="
          background:#0d47a1;
          color:white;
          padding:12px 16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        ">

          <b>👨‍🏫 ${schoolName} - Teacher List</b>

          <button
            onclick="closeTeacherPDFModal()"
            style="
              background:white;
              color:#0d47a1;
              border:none;
              border-radius:50%;
              width:32px;
              height:32px;
              font-size:18px;
              font-weight:bold;
              cursor:pointer;
            ">
            ✕
          </button>

        </div>

        <iframe
          src="${pdfUrl}"
          style="
            width:100%;
            height:100%;
            border:none;
            flex:1;
          ">
        </iframe>

        <div style="
          padding:10px;
          text-align:center;
          background:#f5f5f5;
        ">

          <a
            href="${pdfUrl}"
            target="_blank"
            style="
              display:inline-block;
              background:#1976d2;
              color:white;
              padding:9px 18px;
              border-radius:6px;
              text-decoration:none;
              font-weight:bold;
            ">
            ⬇️ Open / Download PDF
          </a>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);
};


// ======================================
// CLOSE TEACHER PDF MODAL
// ======================================

window.closeTeacherPDFModal = function () {

  const modal =
    document.getElementById("teacherPdfModal");

  if (modal) {
    modal.remove();
  }
};
// ======================================
// SCHOOL DISE SEARCH
// ======================================

window.showDISESearch = async function () {

  setContent(`
    <div class="card">

      <h2>🔎 School DISE Search</h2>

      <p>11 digit DISE Code enter ಮಾಡಿ</p>

      <div style="
        display:flex;
        gap:10px;
        flex-wrap:wrap;
      ">

        <input
          type="text"
          id="diseSearchInput"
          maxlength="11"
          inputmode="numeric"
          placeholder="Enter 11 digit DISE Code"
          style="
            padding:12px;
            border:1px solid #ccc;
            border-radius:8px;
            flex:1;
            min-width:220px;
          "
        >

        <button
          onclick="searchSchoolByDISE()"
          style="
            background:#0047a1;
            color:white;
            border:none;
            padding:12px 20px;
            border-radius:8px;
            font-weight:bold;
            cursor:pointer;
          "
        >
          🔎 Search
        </button>

      </div>

      <div id="diseSearchResult" style="margin-top:20px;"></div>

    </div>
  `);
};


// ======================================
// SEARCH SCHOOL BY DISE
// ======================================

// ======================================
// SEARCH ALL SCHOOLS BY DISE
// ======================================

window.searchSchoolByDISE = async function () {

  const input = document.getElementById("diseSearchInput");
  const result = document.getElementById("diseSearchResult");

  const dise = input.value.trim();

  if (!dise) {
    result.innerHTML = `
      <div class="card">
        <p style="color:red;">
          ⚠️ DISE Code enter ಮಾಡಿ.
        </p>
      </div>
    `;
    return;
  }

  if (!/^\d{11}$/.test(dise)) {
    result.innerHTML = `
      <div class="card">
        <p style="color:red;">
          ❌ DISE Code 11 digits ಇರಬೇಕು.
        </p>
      </div>
    `;
    return;
  }

  result.innerHTML = `
    <div class="card">
      <p>🔄 Searching schools...</p>
    </div>
  `;

  try {

    const snapshot = await getDocs(
      collection(db, "schools")
    );

    // ALL matching schools
    const foundSchools = [];

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      const schoolDise =
        data.diseNumber ||
        data.dise ||
        data.diseCode ||
        data.udise ||
        data.udiseCode ||
        data["DISE"] ||
        data["DISE CODE"] ||
        data["DISE Code"] ||
        "";

      if (String(schoolDise).trim() === dise) {

        foundSchools.push({
          id: docSnap.id,
          data: data
        });

      }

    });

    // ======================================
    // NO SCHOOL FOUND
    // ======================================

    if (foundSchools.length === 0) {

      result.innerHTML = `
        <div class="card">
          <h3 style="color:red;">
            ❌ School Not Found
          </h3>

          <p>
            DISE Code:
            <b>${dise}</b>
          </p>
        </div>
      `;

      return;
    }


    // ======================================
    // SHOW ALL SCHOOLS
    // ======================================

    let html = `
      <div style="
        margin-bottom:15px;
        padding:12px;
        background:#e8f1ff;
        border-radius:8px;
      ">
        <h3 style="margin:0;color:#0047a1;">
          🏫 ${foundSchools.length} School(s) Found
        </h3>

        <p style="margin:5px 0 0;">
          <b>DISE Code:</b> ${dise}
        </p>
      </div>
    `;


    foundSchools.forEach((school, index) => {

      const data = school.data;

      const schoolName =
        data.schoolName ||
        data.school ||
        data["SCHOOL NAME"] ||
        data["School Name"] ||
        data.name ||
        "School";

      const cluster =
        data.cluster ||
        data.clusterName ||
        data["CLUSTER NAME"] ||
        data["Cluster Name"] ||
        data.CLUSTER ||
        "-";

      const management =
        data.management ||
        data.schoolType ||
        data.type ||
        data["MANAGEMENT"] ||
        data["Management"] ||
        data["SCHOOL TYPE"] ||
        "-";


      html += `

        <div style="
          background:white;
          border-radius:12px;
          padding:18px;
          margin-bottom:15px;
          box-shadow:0 2px 10px rgba(0,0,0,0.12);
          border-left:5px solid #0047a1;
        ">

          <h2 style="
            color:#0047a1;
            margin-top:0;
          ">
            🏫 ${index + 1}. ${schoolName}
          </h2>

          <p>
            <b>DISE Code:</b> ${dise}
          </p>

          <p>
            <b>Cluster:</b> ${cluster}
          </p>

          <p>
            <b>Management:</b> ${management}
          </p>

          <button
            onclick="showSelectedSchool('${school.id}')"
            style="
              background:#0047a1;
              color:white;
              border:none;
              padding:11px 18px;
              border-radius:8px;
              font-weight:bold;
              cursor:pointer;
            "
          >
            🏫 Open School
          </button>

        </div>

      `;

    });


    result.innerHTML = html;


  } catch (error) {

    console.error(
      "DISE Search Error:",
      error
    );

    result.innerHTML = `
      <div class="card">

        <h3 style="color:red;">
          ❌ Search Error
        </h3>

        <p>
          ${error.message}
        </p>

      </div>
    `;

  }

};
window.showBEOProfile = function () {
    document.getElementById("content").innerHTML = `
        <div class="beo-profile">
            <img src="BEО_KLB(N).png" alt="BEO Photo">
            <h2>BEO Kalaburagi North</h2>
            <p><b>Block Education Officer</b></p>
            <p>📞 Phone: XXXXX XXXXX</p>
        </div>
    `;
};
window.showBEOProfile = function () {
    document.getElementById("content").innerHTML = `
        <div class="card" style="text-align:center; padding:30px;">
            <img src="./BEO_KLB(N).png"
                 style="width:140px !important;
                        height:140px !important;
                        object-fit:cover;
                        border-radius:50%;">
            <h2>Sri.Somashekhar Hanchinal</h2>
            <p><b>Block Education Officer.Klb(n)</b></p>
            <p>📞 Phone: 9448892043</p>
        </div>
    `;
};
// GALLERY IMAGE FULL SCREEN
document.addEventListener("click", function(e) {

    if (e.target.tagName === "IMG" &&
        e.target.closest(".card")) {

        const img = e.target;

        const overlay = document.createElement("div");

        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.9)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "99999";
        overlay.style.cursor = "pointer";

        const bigImg = document.createElement("img");

        bigImg.src = img.src;
        bigImg.alt = img.alt;

        bigImg.style.maxWidth = "95%";
        bigImg.style.maxHeight = "90%";
        bigImg.style.objectFit = "contain";
        bigImg.style.borderRadius = "10px";

        overlay.appendChild(bigImg);
        document.body.appendChild(overlay);

        overlay.onclick = function() {
            overlay.remove();
        };
    }
});
// SIDE MENU OPEN / CLOSE
window.toggleSideGroup = function(groupId) {

    const group = document.getElementById(groupId);

    if (!group) return;

    group.classList.toggle("open");
};
// School Side Menu visibility


document.addEventListener("click", function(e) {
    const navButton = e.target.closest("nav.menu button");
    const sideMenu = document.getElementById("schoolSideMenu");

    if (!navButton || !sideMenu) return;

    sideMenu.style.setProperty("display", "none", "important");
    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
}, true);
