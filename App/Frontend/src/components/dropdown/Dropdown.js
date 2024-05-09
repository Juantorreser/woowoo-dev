import React, {useState} from 'react';
import './dropdown.css';
import Services from './Services.js';

const DropdownMenu = ({
    listName, 
    data, 
    getHealersWithFilter,
    filters, 
    }) => {

	//TODO: use this to highlight the selected filter
    //const [ selected, setSelected ] = useState([]);
    const [ open, setOpen ] = useState(false); //determines whether the menu is open
    
    const toggle = () => {
        setOpen(!open);
    };

    const handleClick = (event, listName, item) => {
        filters[listName] = listName;
        filters.param = item;
		
        getHealersWithFilter(filters);

        setOpen(false); //ensures that the menu is closed when an option is selected. 
    };

    return (
        <div className='dd-wrapper'>
			{open ? <i className="arrow arrow-up"></i> : <i className="arrow arrow-down"></i>}
            <div 
            className='dd-menu'
            onKeyPress={() => toggle(!open)} 
            onClick={() => toggle(!open)}>
                <div>
                    <p>{listName}</p>
                </div>
			</div>
			{
				open && (
					<ul className='dd-list'>
						{/*TODO: Error in cmd prompt; Expected to return a value at the end of arrow function  array-callback-return*/}
						{data.map((listItem) => {
                            if(listItem){
                                return (
                                    <li key={listItem} className='dd-list-item'>
                                        <button onClick={(event) => handleClick(event, listName, listItem)}>
                                            <pre>{listItem}</pre>
                                        </button>
                                    </li>
                                )
                            }
						})}
					</ul>
				)
			}
        </div>
    )
}

const Dropdown = ({data, setHealers, getHealersWithFilter}) => {
    let filters = {};
    const [ onlineOption, setOnlineOption ] = useState({value: 1, description: 'Viewing Both'});
	//TODO: setCurrentHealers is never used but currentHealers is
    const currentHealers = data.initHealers;

    //console.log('Dropdown Services ', Services);
    //console.log('Dropdown currentHealers ', currentHealers);

    //gets unique cities from the healer data returned by the search page
    const cities = [...new Set(currentHealers.map((hlr) =>  hlr.city))];

    // Services is currently a hardcoded list imported from ./Services.js as of 2023
    const services = [...new Set(Services.map((hlr) =>  hlr.value))];

    const filterOnline = () => {
        switch(onlineOption.value){
            case 0: 
                setOnlineOption({value: 1, description: 'Viewing Both'});
                break;
            case 1:
                setOnlineOption({value: 2, description: 'Viewing In-person Only'});
                break;
            case 2:
                setOnlineOption({value: 0, description: 'Viewing Online Only'});
                break;
            default:
                setOnlineOption({value: 0, description: 'Viewing Online Only'});
        }

        filters.deliveryFormat = onlineOption.value;
        getHealersWithFilter(filters);
    }

    return (
        <>
            <DropdownMenu 
                listName={'Cities'} 
                data={cities} 
                getHealersWithFilter={getHealersWithFilter} 
                setHealers={setHealers}
				as='select'
                filters={filters}>
            </DropdownMenu>
			
            <DropdownMenu 
                listName={'Services'} 
                data={services} 
                getHealersWithFilter={getHealersWithFilter} 
                setHealers={setHealers}
				as='select'
                filters={filters}>
            </DropdownMenu>

			<div className="dd-wrapper formatButtonWrapper">
				<div className="dd-menu" onClick={filterOnline}><p>{onlineOption.description}</p></div>
			</div>
        </>
    )
}

export default Dropdown;