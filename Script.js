document.addEventListener('DOMContentLoaded', function () {
    const buyEquipmentButton = document.getElementById('buyEquipment');
    const buyLivestockButton = document.getElementById('buyLivestock');
    const sellFishCoralButton = document.getElementById('sellFishCoral');
    const balanceElement = document.getElementById('balance');
    let balance = 0;
    const tanks = {}; // Add a tanks object to store each tank's state
    let tankStates = {};
    const purchaseTankButtons = document.querySelectorAll('.purchase-tank');
    const inventory = {
        equipment: {
            Nano: 1,
            Small: 0,
            Medium: 0,
            Large: 0,
            Monster: 0
        },
        livestock: {
            Clownfish: 0,
            "Yellow Tang": 0,
            "Zoanthids": 0,
            "Xenia": 0
        }
    };
    const cellSize = 50; // Set the fixed size of the grid cells
    const tankDisplay = document.querySelector('.tank-display');
    const tankCapacities = {
        Nano: { rows: 2, cols: 3 },
        Small: { rows: 3, cols: 4 },
        Medium: { rows: 4, cols: 6 },
        Large: { rows: 5, cols: 8 },
        Monster: { rows: 6, cols: 10 }
    };

    const itemFullNames = {
        Nano: 'Nano Tank',
        Small: 'Small Tank',
        Medium: 'Medium Tank',
        Large: 'Large Tank',
        Monster: 'Monster Tank'
    };

    const tankGrid = document.getElementById('tank-grid');
    function createTankGrid(rows, cols) {
        tankGrid.innerHTML = "";

        tankGrid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`; // Set the row height based on the cellSize
        tankGrid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`; // Set the column width based on the cellSize
        tankGrid.style.width = `${cols * cellSize}px`; // Set the grid width based on the cellSize and number of columns

        // Set the tank display container dimensions
        tankDisplay.style.height = `${rows * cellSize}px`;
        tankDisplay.style.width = `${cols * cellSize}px`;

        for (let i = 0; i < rows * cols; i++) {
            const gridCell = document.createElement("div");
            gridCell.classList.add("grid-cell");
            gridCell.addEventListener("dragover", handleDragOver);
            gridCell.addEventListener("drop", handleDrop); // Add drop event listener to each grid cell
            tankGrid.appendChild(gridCell);
        }
    }
    function updateButtonStates() {
        purchaseTankButtons.forEach((button) => {
            const cost = parseInt(button.dataset.cost, 10);

            if (balance >= cost) {
                button.removeAttribute('disabled');
                button.classList.remove('disabled');
            } else {
                button.setAttribute('disabled', true);
                button.classList.add('disabled');
            }
        });
    }

    function updateBalance(amount) {
        balance += amount;
        balanceElement.textContent = Math.round(balance);
        updateButtonStates(); // Update button states based on the new balance
    }

    function updateTankSelectOptions() {
        const tankSelect = document.getElementById('tank-select');
        tankSelect.innerHTML = '';

        for (const tankName in inventory) {
            if (inventory[tankName] > 0) {
                const option = document.createElement('option');
                option.value = tankName;
                option.textContent = `${tankName} Tank (${inventory[tankName]})`;
                tankSelect.appendChild(option);
            }
        }
    }

    function switchTank(tankName) {
        const currentTank = tankSelect.value;
        if (currentTank) {
            saveCurrentTankState(currentTank);
        }
        const { rows, cols } = tankCapacities[tankName];
        createTankGrid(rows, cols);
        loadTankState(tankName);

        switch (tankName) {
            case 'Nano':
                document.getElementById('tank-grid').style.marginTop = '0px';
                break;
            case 'Small':
                document.getElementById('tank-grid').style.marginTop = '-50px';
                break;
            case 'Medium':
                document.getElementById('tank-grid').style.marginTop = '-100px';
                break;
            case 'Large':
                document.getElementById('tank-grid').style.marginTop = '-100px';
                break;
            case 'Monster':
                document.getElementById('tank-grid').style.marginTop = '-150px';
                break;
            default:
                break;
        }
    }

    const tankSelect = document.getElementById('tank-select');

    // Add an event listener for the tank selection dropdown
    tankSelect.addEventListener('change', function () {
        const selectedTank = tankSelect.value;
        switchTank(selectedTank);
        tankDisplay.style.backgroundImage = `url('${selectedTank}.png')`;
    });

    updateBalance(1000000);


    purchaseTankButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const cost = parseInt(button.dataset.cost, 10);
            const tankName = button.dataset.name;

            if (balance >= cost) {
                updateBalance(-cost);
                inventory[tankName] = 1; // Set the tank quantity to 1 instead of incrementing it
                console.log(`Purchased ${tankName} Tank. New inventory:`, inventory);
                updateTankSelectOptions();

                // Replace the button with the "owned" text
                const ownedText = document.createElement('span');
                ownedText.textContent = 'Owned';
                button.parentElement.replaceChild(ownedText, button);
            } else {
                console.log(`Not enough balance to purchase ${tankName} Tank.`);
            }
        });
    });

    buyEquipmentButton.addEventListener('click', function () {
        const equipmentShop = document.querySelector('.equipment-shop');
        equipmentShop.style.display = equipmentShop.style.display === 'none' ? 'block' : 'none';
    });
    buyLivestockButton.addEventListener('click', function () {
        // Add functionality for buying livestock
        console.log('Buy livestock button clicked');
    });

    sellFishCoralButton.addEventListener('click', function () {
        // Add functionality for selling fish and corals
        console.log('Sell fish and corals button clicked');
    });

    // Initialize the tank grid with the Nano tank
    createTankGrid(tankCapacities.Nano.rows, tankCapacities.Nano.cols);

    // Set Nano tank inventory to 1 by default
    inventory.Nano = 1;

    // Replace the Nano tank purchase button with "Owned" text
    const nanoTankButton = document.querySelector('[data-name="Nano"]');
    const ownedText = document.createElement('span');
    ownedText.textContent = 'Owned';
    nanoTankButton.parentElement.replaceChild(ownedText, nanoTankButton);

    // Automatically select the Nano tank in the tank selector
    updateTankSelectOptions();
    tankSelect.value = 'Nano';
    tankDisplay.style.backgroundImage = `url('nano.png')`;

    const toggleLivestockShopButton = document.getElementById('buyLivestock');
    const livestockShop = document.querySelector('.livestock-shop');


    toggleLivestockShopButton.addEventListener('click', function () {
        livestockShop.style.display = livestockShop.style.display === 'none' ? 'block' : 'none';
    });
    const viewInventoryButton = document.getElementById('viewInventoryButton');

    function updateInventoryView() {
        const inventoryItemsContainer = document.querySelector('.inventory-items');
        inventoryItemsContainer.innerHTML = '';

        // Create equipment section header
        const equipmentSectionHeader = document.createElement('h3');
        equipmentSectionHeader.textContent = 'Equipment';
        inventoryItemsContainer.appendChild(equipmentSectionHeader);

        // Display equipment items
        for (const itemName in inventory.equipment) {
            if (inventory[itemName] > 0) {
                const itemQuantity = inventory.equipment[itemName];
                const itemElement = document.createElement('p');
                itemElement.id = `${itemName}:equipment`;
                itemElement.textContent = `${itemName}: ${itemQuantity}`;
                inventoryItemsContainer.appendChild(itemElement);

                makeItemDraggable(itemElement);
            }
        }

        // Create livestock section header
        const livestockSectionHeader = document.createElement('h3');
        livestockSectionHeader.textContent = 'Livestock';
        inventoryItemsContainer.appendChild(livestockSectionHeader);

        for (const itemName in inventory.livestock) {
            const itemQuantity = inventory.livestock[itemName];
            if (itemQuantity > 0) {
                const itemElement = document.createElement('p');
                itemElement.textContent = `${itemName}: ${itemQuantity}`;
                itemElement.id = `${itemName}:livestock`;
                inventoryItemsContainer.appendChild(itemElement);

                makeLivestockDraggable(itemElement); // add this line
            }
        }
    }
    viewInventoryButton.addEventListener('click', function () {
        console.log('View Inventory button clicked'); // Add this line
        updateInventoryView();
        const inventoryView = document.querySelector('.inventory-view');
        inventoryView.style.display = inventoryView.style.display === 'none' ? 'block' : 'none';
    });

    const purchaseLivestockButtons = document.querySelectorAll('.purchase-livestock');

    purchaseLivestockButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const cost = parseInt(button.dataset.cost, 10);
            const itemName = button.dataset.name;

            if (balance >= cost) {
                updateBalance(-cost);
                inventory.livestock[itemName] += 1;
                console.log(`Purchased ${itemName}. New livestock inventory:`, inventory.livestock);
                updateInventoryView(); // Update the inventory view to display the newly purchased item
            } else {
                console.log(`Not enough balance to purchase ${itemName}.`);
            }
        });
    });

    function handleDragStart(e) {
        console.log(e.target.id)
        const itemId = e.target.id;
        let itemType = "";
    
        for (const key in inventory) {
            if (inventory[key].hasOwnProperty(itemId)) {
                itemType = key;
                break;
            }
        }
    
        const data = `${itemType}${itemId}`;
        e.dataTransfer.setData('application/x-itemdata', data);
        console.log('handleDragStart data:', data);
    }
    function makeItemDraggable(itemElement) {
        if (itemElement) {
            itemElement.draggable = true;
            itemElement.addEventListener('dragstart', handleDragStart);

            const dragHandle = document.createElement('div');
            dragHandle.classList.add('drag-handle');
            itemElement.appendChild(dragHandle);
        }
    }

    function makeLivestockDraggable(itemElement) {
        if (itemElement) {
            itemElement.draggable = true;
            itemElement.addEventListener('dragstart', handleDragStart);

            const dragHandle = document.createElement('div');
            dragHandle.classList.add('drag-handle');
            itemElement.appendChild(dragHandle);
        }
    }
    function makeGridItemDraggable(itemElement) {
        if (itemElement) {
            itemElement.draggable = true;
            itemElement.addEventListener('dragstart', handleDragStart);
            
            const dragHandle = document.createElement('div');
            dragHandle.classList.add('drag-handle');
            itemElement.appendChild(dragHandle);
        }
    }
    

    function handleDragOver(e) {
        e.preventDefault();
    }
    function handleDrop(e) {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/x-itemdata');
        const [itemId, itemType] = data.split(':');
    
        let gridCell = e.target;
    
        // Make sure the gridCell is always the grid-cell element
        while (!gridCell.classList.contains('grid-cell')) {
            gridCell = gridCell.parentElement;
        }
    
        console.log(data.split(':'));
        if (itemType === 'equipment') {
            const itemElement = document.getElementById(itemId);
            const itemName = itemId;
            console.log(`Dropped ${itemName} (${itemType}) into the tank.`);
            const displayItem = document.createElement('img');
            displayItem.src = `${itemName}.png`;
            displayItem.classList.add('equipment');
            if (gridCell.classList.contains('grid-cell')) {
                gridCell.appendChild(displayItem);
                inventory.livestock[itemName] -= 1;
                console.log(`Added ${itemName} to the tank. New equipment inventory:`, inventory.equipment);
                updateInventoryView(); // Update the inventory view to reflect the change
            }
        } else if (itemType === 'livestock') {
            const itemName = itemId;
            console.log(`Dropped ${itemName} (${itemType}) into the tank.`);
            const displayItem = document.createElement('img');
            displayItem.src = `${itemName}.png`;
            displayItem.classList.add('livestock');
            if (gridCell.classList.contains('grid-cell')) {
                gridCell.appendChild(displayItem);
                inventory.livestock[itemName] -= 1;
                console.log(`Added ${itemName} to the tank. New livestock inventory:`, inventory.livestock);
                updateInventoryView(); // Update the inventory view to reflect the change
            }
            if (gridCell.classList.contains('grid-cell')) {
                gridCell.appendChild(displayItem);
                inventory.livestock[itemName] -= 1;
                console.log(`Added ${itemName} to the tank. New livestock inventory:`, inventory.livestock);
                updateInventoryView(); // Update the inventory view to reflect the change
        
                saveCurrentTankState(tankSelect.value); // Save the current tank's state after dropping an item
            }
        }
    }
    function saveCurrentTankState(tankName) {
        const tankState = Array.from(tankGrid.children).map(gridCell => {
            return {
                innerHTML: gridCell.innerHTML,
                equipment: gridCell.querySelector('.equipment')?.outerHTML,
                livestock: gridCell.querySelector('.livestock')?.outerHTML
            };
        });
        tankStates[tankName] = tankState; // Save the tank state to the tankStates object
    }
    function loadTankState(tankName) {
        if (tankStates[tankName]) {
            tankStates[tankName].forEach((cellState, index) => {
                const gridCell = tankGrid.children[index];
                gridCell.innerHTML = ''; // Clear the grid cell first
                if (cellState.equipment) {
                    gridCell.innerHTML = cellState.equipment;
                }
                if (cellState.livestock) {
                    gridCell.innerHTML += cellState.livestock;
                }
            });
        } else {
            // If no saved state is found, initialize an empty tank
            Array.from(tankGrid.children).forEach(gridCell => {
                gridCell.innerHTML = '';
            });
        }
    }
    function changeTank(e) {
        e.preventDefault();
    
        // Save the current tank state
        saveCurrentTankState(selectedTank.textContent);
    
        // Load the new tank state
        selectedTank.textContent = e.target.textContent;
        loadTankState(selectedTank.textContent);
    
        // Close the dropdown menu
        tankDropdownMenu.classList.remove('show');
    }
});