import React, { useEffect, useState } from "react";
import axios from 'axios';
import './search.css';
import './healerFrame.css';
import Dropdown from '../../dropdown/Dropdown';
import HealerModal from './healerModal';
import $ from "jquery";

const Healers = ({data, getHealersWithFilter, setHealers, range, setRange, getMarkers}) => {
	const [ expandedTicket, setExpandedTicket ] = useState(false);
	const [ healerState, setHealerState ] = useState({});
	const [ bookingModal, setBookingModal ] = useState(false);
	const [ reviewModal, setReviewModal ] = useState(false);

	//the healers listing should re-render on change of the map markers or the range slider. 
	useEffect(() => {
	}, [data.currMarkers, range]);

	const handleRange = (range) => { 
		getHealersWithFilter({range: range});
	};

	//Applies/removes the healerImgHovered class to the healer item when hovering over on of the icons
	$((".healer .icons img")).mouseenter(function() {
		$(this).closest(".healer").toggleClass("healerImgHovered", true)
	});
	$((".healer .icons img")).mouseleave(function() {
		$(this).closest(".healer").toggleClass("healerImgHovered", false)
	});

	return(
		<div>
			{(() => {
				if(expandedTicket && healerState){ 
					return(
						<HealerModal
							healerState={healerState}
							setExpandedTicket={setExpandedTicket}
							bookingModal={bookingModal}
							setBookingModal={setBookingModal}
							reviewModal={reviewModal}
							setReviewModal={setReviewModal}
						/>
					);
				}
			})()}
			<div className="top_left">
				<div className="healerResults">
					<div className="page-deets">
						<img className="img_region" 
							src={require("../../../Images/regions/toronto.jpg" )}
							alt=""
						/>
						<h1>Search</h1>
						<div className="sortBar">
							{
								data.healers ? <Dropdown 
									data={data}
									getHealersWithFilter={getHealersWithFilter}
									setHealers={setHealers}
									>
								</Dropdown> : <div>Loading...</div>
							}
						</div>
						<div className="slidecontainer">
							Max Distance: 
							<input 
							type="range" 
							min="1" 
							max="100" 
							value={range}
							onChange={(e) => {
								setRange(e.target.value)
							}}
							onMouseUp={(e) => {
								handleRange(e.target.value);
							}}
							className="slider" 
							id="myRange"/>
							<p>{range} km</p>
						</div>
						<hr/>
					</div>
				</div>
	
				<div className="users">
					{
						data.healers ? data.healers.map(
							(healer) =>{
								return(
									<li key={healer.uid} >
										<script>
											{}
										</script>
										<div className="healer">
											<div className="healerColumn2">
												<div className="healerTop">
													<p>{healer.firstName} {healer.lastName}</p>
													<div className='icons'>
														<img 
															className="icon" 
															src={require("../../../Images/icons/1.png" )}
															onClick={() => {
																setHealerState(healer);
																setBookingModal(!bookingModal);
																setExpandedTicket(!expandedTicket);
															}}
															alt="Open calendar modal"
														/>
														<img 
															className="icon" 
															src={require("../../../Images/icons/2.png" )}
															onClick={() => {
																setHealerState(healer);
																setReviewModal(!reviewModal);
																setExpandedTicket(!expandedTicket);
															}}
															alt="Open review modal"
														/>
														<img className="icon" 
															src={require("../../../Images/icons/3.png" )}
															alt="Open something, currently does nothing"
														/>
													</div>
												</div>
												<div className="healerMiddle">
													<p>{
														//number of services.. we can set this limit as needed.
														healer.services.split(',').length > 2 ? 
														`${healer.services.split(',')[0]}, ${healer.services.split(',')[1]}, and more...` :
														healer.services.replace(',', ', ')
													}</p>
												</div>
												<hr/>
												<div className="healerBottom">
													<pre>{healer.description}</pre>
												</div>
											</div>
											<div className="healerModalButton"
												onClick={() => {
													setHealerState(healer);
													setExpandedTicket(!expandedTicket);
												}}
											/>
											
										</div>
									</li>
								)
							}
						) : <div className="loaderContainer">
								<div className="loader"></div>
							</div>
					}
				</div>
			</div>
		</div>
	);
}

export default Healers;