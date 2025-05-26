document.getElementById('aasForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const idShort = document.getElementById('idShort').value;
    const identificationId = document.getElementById('identificationId').value;
    const endpoint = document.getElementById('endpoint').value;

    const aasData = {
        idShort: idShort,
        identification: {
            id: identificationId,
            idType: "Custom"
        },
        endpoints: [
            {
                type: "http",
                address: endpoint
            }
        ],
        submodels: [
            {
                idShort: "MyQuickStartSubmodel",
                identification: {
                    id: "MyQuickStartSubmodelID"
                },
                endpoints: [
                    {
                        type: "http",
                        address: `${endpoint}/aas/submodels/MyQuickStartSubmodel`
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`http://localhost:8082/registry/api/v1/registry/${identificationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aasData)
        });

        if (response.ok) {
            alert('AAS successfully created!');
            fetchAAS(); // Refresh the AAS list
        } else {
            alert('Failed to create AAS');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating AAS');
    }
});

document.getElementById('editAasForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const idShort = document.getElementById('editIdShort').value;
    const identificationId = document.getElementById('editIdentificationId').value;
    const endpoint = document.getElementById('editEndpoint').value;

    const aasData = {
        idShort: idShort,
        identification: {
            id: identificationId,
            idType: "Custom"
        },
        endpoints: [
            {
                type: "http",
                address: endpoint
            }
        ],
        submodels: [
            {
                idShort: "MyQuickStartSubmodel",
                identification: {
                    id: "MyQuickStartSubmodelID"
                },
                endpoints: [
                    {
                        type: "http",
                        address: `${endpoint}/aas/submodels/MyQuickStartSubmodel`
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`http://localhost:8082/registry/api/v1/registry/${identificationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aasData)
        });

        if (response.ok) {
            alert('AAS successfully updated!');
            fetchAAS(); // Refresh the AAS list
            document.getElementById('editAasForm').style.display = 'none';
        } else {
            alert('Failed to update AAS');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating AAS');
    }
});

let allAAS = [];
let currentPage = 1;
const pageSize = 10;

function displayAAS(aasList, page = 1) {
    const container = document.getElementById('aas-container');
    container.innerHTML = '';

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageAssets = aasList.slice(start, end);

    pageAssets.forEach(aas => {
        const aasElement = document.createElement('div');
        aasElement.className = 'aas-item';
        aasElement.innerHTML = `
            <img src="brazo-robotico.jpg" alt="Asset" class="asset-img">
            <h3 title="${aas.idShort}">${aas.idShort}</h3>
            <p title="${aas.identification.id}">ID: ${aas.identification.id}</p>
            <p title="${aas.endpoints[0].address}">Endpoint: ${aas.endpoints[0].address}</p>
            <div id="submodels-${aas.identification.id}" class="submodel-container"></div>
            <button class="edit" onclick="event.stopPropagation(); editAAS('${aas.identification.id}', '${aas.idShort}', '${aas.endpoints[0].address}')">Edit</button>
            <button onclick="event.stopPropagation(); deleteAAS('${aas.identification.id}')">Delete</button>
            <button onclick="event.stopPropagation(); toggleSubmodels('${aas.identification.id}')">Toggle Submodels</button>
            <button class="report" onclick="event.stopPropagation(); openReportModal('${aas.identification.id}', '${aas.idShort}')">Report</button>
        `;
        aasElement.onclick = function(e) {
            // Evita que el click en los botones dispare la redirección
            if (e.target.tagName.toLowerCase() === 'button') return;
            window.location.href = `detailed-asset.html?id=${encodeURIComponent(aas.identification.id)}`;
        };
        container.appendChild(aasElement);
    });

    // Mostrar u ocultar el botón "Show More" según corresponda
    const showMoreBtn = document.getElementById('showMoreBtn');
    showMoreBtn.style.display = '';
    showMoreBtn.textContent = 'See all';
}

async function fetchAAS() {
    try {
        const response = await fetch('http://localhost:8082/registry/api/v1/registry');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allAAS = data;
        displayAAS(allAAS, 1);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function editAAS(id, idShort, endpoint) {
    document.getElementById('editIdentificationId').value = id;
    document.getElementById('editIdShort').value = idShort;
    document.getElementById('editEndpoint').value = endpoint;
    document.getElementById('editAasForm').style.display = 'block';
}

async function deleteAAS(id) {
    if (confirm('Are you sure you want to delete this AAS?')) {
        try {
            const response = await fetch(`http://localhost:8082/registry/api/v1/registry/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('AAS successfully deleted!');
                fetchAAS(); // Refresh the AAS list
            } else {
                alert('Failed to delete AAS');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting AAS');
        }
    }
}

async function toggleSubmodels(id) {
    const submodelContainer = document.getElementById(`submodels-${id}`);
    if (submodelContainer.style.display === 'none') {
        try {
            const response = await fetch(`http://localhost:8082/registry/api/v1/registry/${id}/submodels`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const submodels = await response.json();
            submodelContainer.innerHTML = ''; // Clear any existing content
            submodels.forEach(submodel => {
                const submodelElement = document.createElement('div');
                submodelElement.className = 'submodel-item';
                submodelElement.innerHTML = `
                    <p>Submodel ID Short: ${submodel.idShort}</p>
                    <p>Submodel ID: ${submodel.identification.id}</p>
                `;
                submodelContainer.appendChild(submodelElement);
            });
            submodelContainer.style.display = 'block';
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    } else {
        submodelContainer.style.display = 'none';
    }
}

function searchAAS() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const aasItems = document.getElementsByClassName('aas-item');

    Array.from(aasItems).forEach(item => {
        const idShort = item.getElementsByTagName('h3')[0].innerText.toLowerCase();
        if (idShort.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function openReportModal(aasId, aasName) {
    document.getElementById('reportAasId').value = aasId;
    document.getElementById('reportMessage').value = '';
    document.getElementById('reportModal').style.display = 'flex';
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const aasId = document.getElementById('reportAasId').value;
            const message = document.getElementById('reportMessage').value;

            try {
                const response = await fetch('http://localhost:9090/api/report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        aasId: aasId,
                        message: message
                    })
                });
                if (response.ok) {
                    alert('Report sent successfully.');
                    closeReportModal();
                } else {
                    alert('Failed to send report.');
                }
            } catch (error) {
                alert('Error sending report.');
            }
        });
    }
});

window.onload = fetchAAS;