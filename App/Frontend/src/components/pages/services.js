import React from 'react'
import Dropdown from '../dropdown/Dropdown';

class Services extends React.Component{
    render(){
        return(
        <div className=''>
            <div className="">
                <Dropdown>
                    <p>City</p>
                    <p>Services</p>
                    <p>Tags</p>
                </Dropdown>
            </div>
        </div>
);
}
}

export default Services