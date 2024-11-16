// Chuyển qua lại dark mode
const themeSwitchCheckbox = document.querySelector('.theme-switch__checkbox');
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeSwitchCheckbox.checked = true;
}
themeSwitchCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// đăng ký the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}


// lấy API từ Google Sheet
const apiUrl1 = 'https://script.google.com/macros/s/AKfycbxIDXSMWaY0HkqMhNM1zqD-a_uQyN8vOhPLOLYYKKGEQ6rrM-v_iWOMFhmuMLHle0Ii/exec';
const apiUrl2 = 'https://script.google.com/macros/s/AKfycbzLftLOZkcFz1CuN01pT1RaGKYo2N0aJox0kLsUNgtWNh83Kb1wSk52O2CE9tBdc8VWDg/exec';

// Function to fetch data from any API URL
async function fetchDataFromApi(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// Function to format URLs as clickable links
function formatResponse(response) {
    var urlRegex = /(https?:\/\/[^\s<]+)/g;
    return response.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

function updateTable(data, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = "";  // Clear existing data

    if (data.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;  // Adjust colspan according to your table's column count
        td.textContent = "No data available";
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }

    data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.style.whiteSpace = 'pre-wrap';  // Preserve line breaks in content
            let formattedCell = cell.replace(/\n/g, "<br>");  // Replace newlines with <br> tags
            formattedCell = formatResponse(formattedCell);  // Format URLs as links
            td.innerHTML = formattedCell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

async function fetchData() {
    const data1 = await fetchDataFromApi(apiUrl1);  // Fetch data from first API
    const data2 = await fetchDataFromApi(apiUrl2);  // Fetch data from second API

    updateTable(data1, "table-body1");  // Update table-body1 with data from API 1
    updateTable(data2, "table-body2");  // Update table-body2 with data from API 2
}
fetchData();


// Ẩn các khung
function hideAllFrameViews() {
    const allFrameViews = document.querySelectorAll('.Frame_view');
    allFrameViews.forEach(frame => {
        frame.style.display = 'none';
    });
}

function showFrameView(frameView) {
    hideAllFrameViews(); // Hide all frameViews first
    frameView.style.display = 'flex'; // Show the clicked frameView
}

const clickableArea1 = document.querySelector('.More_documents_n_Annoucements');
const frameView1 = document.querySelector('.Frame1');
clickableArea1.addEventListener('click', function() {
    showFrameView(frameView1); // Show Frame1
});

const clickableArea2 = document.querySelector('.Annoucements');
const frameView2 = document.querySelector('.Frame2');
clickableArea2.addEventListener('click', function() {
    showFrameView(frameView2); // Show Frame2
});

const clickableArea3 = document.querySelector('.Calendar');
const frameView3 = document.querySelector('.Frame3');
clickableArea3.addEventListener('click', function() {
    showFrameView(frameView3); // Show Frame3
});

const clickableArea4 = document.querySelector('.Setting');
const frameView4 = document.querySelector('.Frame4');
clickableArea4.addEventListener('click', function() {
    showFrameView(frameView4); // Show Frame4
});

const homeButton = document.querySelector('.home');
homeButton.addEventListener('click', function() {
    hideAllFrameViews(); // Hide all frameViews when home is clicked
});

// Tính năng tìm kiếm documents và chữ cái đầu
var debounceTimeout;

function searchContent(contentType) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(function() {
        var input, filter, table, tr, td, i, j, txtValue;

        // Dynamically set input and table based on contentType
        if (contentType === 'moreDocuments') {
            input = document.getElementById('searchBoxMoreDocuments');
            table = document.getElementById('moreDocumentsTable');
        } else if (contentType === 'announcements') {
            input = document.getElementById('searchBoxAnnouncements');
            table = document.getElementById('announcementsTable');
        }

        filter = input.value.toUpperCase().split(' '); // Split the input value by spaces
        tr = table.getElementsByTagName('tr'); // Get all rows in the table

        // Loop through each row in the table
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName('td'); // Get all cells in the row
            var found = false;

            // Loop through each cell in the row
            for (j = 0; j < td.length; j++) {
                txtValue = td[j].textContent || td[j].innerText; // Get the text content of the cell
                // Create an array of the first letter of each word in the cell text
                var firstLetters = txtValue.split(' ').map(function(word) {
                    return word[0];
                }).join(''); // Join the first letters together

                // Check if the filter text matches the full text or the first letters of the cell
                var matchText = filter.every(r => txtValue.toUpperCase().indexOf(r) >= 0); // Match full text
                var matchFirstLetters = filter.some(r => firstLetters.toUpperCase().indexOf(r) >= 0); // Match first letters

                if (matchText || matchFirstLetters) {
                    found = true;
                    break; // If a match is found, no need to check other cells in this row
                }
            }

            // Hide or show rows based on whether a match was found
            if (found) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }, 150); // Debounce the search with a delay of 150ms
}


// Bấm nút refresh
const refreshButtoncontainer = document.getElementById('refreshButton_container');
refreshButtoncontainer.addEventListener('click', () => {
  setTimeout(() => {
    location.reload();
  }, 1000);
});


//Ẩn các nút More Documents và Announcements
const mdFrameButton = document.querySelector('.MDFrame-button');
const anoFrameButton = document.querySelector('.ANOFrame-button');
const mdFrame = document.querySelector('.MDFrame');
const anoFrame = document.querySelector('.ANOFrame');

function showMDFrame() {
    mdFrame.style.display = 'block';
    anoFrame.style.display = 'none';
}

function showANOFrame() {
    mdFrame.style.display = 'none';
    anoFrame.style.display = 'block';
}

mdFrameButton.addEventListener('click', showMDFrame);
anoFrameButton.addEventListener('click', showANOFrame);

