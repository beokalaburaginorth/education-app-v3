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

    const dashboardRef =
      doc(db, "dashboard", "statistics");

    const dashboardSnap =
      await getDoc(dashboardRef);

    let stats = {

      govtPrimarySchools: 0,
      govtHighSchools: 0,
      aidedPrimarySchools: 0,
      aidedHighSchools: 0,

      govtPrimaryTeachers: 0,
      govtHighTeachers: 0,
      aidedPrimaryTeachers: 0,
      aidedHighTeachers: 0

    };

    if (dashboardSnap.exists()) {

      stats = {
        ...stats,
        ...dashboardSnap.data()
      };

    }


    // =======================
    // TOTALS
    // =======================

    const totalSchools =
      Number(stats.govtPrimarySchools) +
      Number(stats.govtHighSchools) +
      Number(stats.aidedPrimarySchools) +
      Number(stats.aidedHighSchools);


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
                ${
                  Number(stats.govtPrimarySchools) +
                  Number(stats.govtHighSchools)
                }
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
                ${
                  Number(stats.aidedPrimarySchools) +
                  Number(stats.aidedHighSchools)
                }
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

              position: "bottom"

            }

          }

        }

      }
    );


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

    const galleryRef =
      collection(db, "gallery");

    const snapshot =
      await getDocs(galleryRef);


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

      snapshot.forEach((docSnap) => {

        const data =
          docSnap.data();


        const imageUrl =

          data.imageUrl ||

          data.imageURL ||

          data.url ||

          data.photo ||

          data.image;


        const title =

          data.title ||

          data.name ||

          "Gallery Image";


        if (imageUrl) {

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
                "

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

    console.error(
      "Gallery Error:",
      error
    );


    setContent(`

      <h2>🖼️ Gallery</h2>

      <div class="card">

        <h3>Gallery Error</h3>

        <p>${error.message}</p>

      </div>

    `);

  }

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

window.showSchoolSelector = async function () {

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

    document.getElementById("schoolInfo").innerHTML = html;

  } catch (error) {

    console.error("Teacher PDF Error:", error);

    document.getElementById("schoolInfo").innerHTML =
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

window.searchSchoolByDISE = async function () {

  const input =
    document.getElementById("diseSearchInput");

  const result =
    document.getElementById("diseSearchResult");

  const dise =
    input.value.trim();

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
      <p>🔄 Searching school...</p>
    </div>
  `;

  try {

    const snapshot =
      await getDocs(
        collection(db, "schools")
      );

    let foundSchool = null;

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      // Find DISE field automatically
const diseKey = Object.keys(data).find(key => {
  const k = key.toLowerCase().replace(/[\s_-]/g, "");
  return (
    k.includes("dise") ||
    k.includes("udise")
  );
});

const schoolDise = diseKey
  ? String(data[diseKey]).trim()
  : "";

if (schoolDise === dise) {
  foundSchool = {
    id: docSnap.id,
    data: data
  };
}


    });

    if (!foundSchool) {

      result.innerHTML = `
        <div class="card">
          <h3>❌ School Not Found</h3>
          <p>
            DISE Code:
            <b>${dise}</b>
          </p>
        </div>
      `;

      return;
    }

    const data = foundSchool.data;

    const schoolName =
      data.schoolName ||
      data.school ||
      data["SCHOOL NAME"] ||
      data["School Name"] ||
      data.name ||
      "School";

    const cluster =
      data.clusterName ||
      data.cluster ||
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

    result.innerHTML = `

      <div style="
        background:white;
        border-radius:12px;
        padding:18px;
        box-shadow:0 2px 10px rgba(0,0,0,0.12);
        border-left:5px solid #0047a1;
      ">

        <h2 style="color:#0047a1;">
          🏫 ${schoolName}
        </h2>

        <p>
          <b>DISE Code:</b>
          ${dise}
        </p>

        <p>
          <b>Cluster:</b>
          ${cluster}
        </p>

        <p>
          <b>Management:</b>
          ${management}
        </p>

        <button
          onclick="showSelectedSchool('${foundSchool.id}')"
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

