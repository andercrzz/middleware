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

async function fetchAAS() {
    try {
        const response = await fetch('http://localhost:8082/registry/api/v1/registry');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayAAS(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayAAS(aasList) {
    const container = document.getElementById('aas-container');
    container.innerHTML = ''; // Clear any existing content

    aasList.forEach(aas => {
        const aasElement = document.createElement('div');
        aasElement.className = 'aas-item';
        aasElement.innerHTML = `
            <h3>${aas.idShort}</h3>
            <p>ID: ${aas.identification.id}</p>
            <p>Endpoint: ${aas.endpoints[0].address}</p>
            <button class="edit" onclick="editAAS('${aas.identification.id}', '${aas.idShort}', '${aas.endpoints[0].address}')">Edit</button>
            <button onclick="deleteAAS('${aas.identification.id}')">Delete</button>
        `;
        container.appendChild(aasElement);
    });
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

window.onload = fetchAAS;