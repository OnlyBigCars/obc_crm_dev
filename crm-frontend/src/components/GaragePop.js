import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin } from 'lucide-react';

const GarageSelector = ({ onClose, onSelectGarage }) => {
  const [modelSearchQuery, setModelSearchQuery] = useState('');

  const garages = [
    {
      name: 'Onlybigcars - Automan Car',
      mechanic: 'Abhijit Sir',
      locality: '16-347, NH75, Sharadamba Nagar, Muthyala Nagar, Bahubali Nagar, Jalahalli, Bengaluru, Karnataka 560013',
      link:'https://maps.app.goo.gl/7mGMQPHUQKyqP8vx6',
      mobile: '9663663100'
    },
    {
      name: 'Onlybigcars - Throttle Car 2',
      mechanic: 'NA',
      locality: 'Manjunatha layout, thubarahalli, munnekollal, Bangalore 560066',
      link:'https://maps.app.goo.gl/JpiJajyrJ2zQRLE19',
      mobile: '9964513326'
    },
    {
      name: 'Onlybigcars - Torquee Motors',
      mechanic: 'NA',
      locality: 'Chaithiyana Annanya, opp to lakshmi Hyundai, seegehalli, Bangalore 560067',
      link:' https://maps.app.goo.gl/SmYfKxQeoVyvD5Dm6',
      mobile: '9964513326'
    },
    {
      name: 'Onlybigcars - Throttle Car 1',
      mechanic: 'NA',
      locality: 'Avalahalli main road, virgonagar post, Rampura, Bangalore 560049',
      link:'https://maps.app.goo.gl/8mURXvzU96Gts1Bz5',
      mobile: '9964513326'
    },
    {
      name: 'Onlybigcars - Super Cars',
      mechanic: 'NA',
      locality: '51, Dinnur main road, post, RT Nagar, Bengaluru, Karnataka 560032',
      link:'https://maps.app.goo.gl/3YBwxLdkdLk4ei4a8',
      mobile: '9341701325'
    },
    {
      name: 'Onlybigcars - Super Motors, vikaspuri',
      mechanic: 'NA',
      locality: 'Rd Number 237, LIG MIG flats, Pocket A, Hastsal, Delhi, 110066',
      link:'https://maps.app.goo.gl/aRRuVn7sQ2XNi2HW6',
      mobile: '8447770864'
    },
    {
      name: 'Onlybigcars - Motor Masters, Wazirpur',
      mechanic: 'NA',
      locality: ' Block B, Wazirpur Industrial Area, Ashok Vihar, Delhi, 110052',
      link:'https://maps.app.goo.gl/jMxKDGsyeKcQym7o9',
      mobile: '9999902802'
    },
    {
      name: 'Onlybigcars - Motor Masters, jahangirpuri ',
      mechanic: 'Keshav Gupta',
      locality: '1st Floor, No 69, Udyog Nagar, New Delhi, Delhi 110033 ',
      link:' https://maps.app.goo.gl/qHgtiEPGYXWubeXJ6',
      mobile: '9999902802'
    },
    {
      name: 'Onlybigcars - Rathi Motors ',
      mechanic: 'Ajay(shree shyam motor)',
      locality: 'S No 2, Max Road, Shalamar, Shalimar Village, Shalimar Bagh, New Delhi, Delhi, 110088 ',
      link:'https://maps.app.goo.gl/ZTkmQQ8jbdHNFuK88',
      mobile: '9891123345'
    },
    {
      name: 'Onlybigcars - Shree Shyaam ji Automobile',
      mechanic: 'Ajay',
      locality: 'C109, Prahlad Vihar, Prahladpur, Rohini, New Delhi, Delhi, 110042',
      link:'https://maps.app.goo.gl/QBejcra9xVa33Srg8',
      mobile: '9891123345'
    },
    {
      name: 'Onlybigcars - Shiv Motors banker narela',
      mechanic: 'kala mistri/Neeraj7',
      locality: '61, Ground Trunk Rd, Banker, narela ',
      link:'https://maps.app.goo.gl/46MYYsFxbT8UkFUGA',
      mobile: '8750322544/7206335057'
    },
    {
      name: 'Onlybigcars - Poorvi Auto Works ',
      mechanic: 'Ankur',
      locality: 'H8RJ+9PF, Noida, Uttar Pradesh',
      link:'-https://maps.app.goo.gl/8w3kbRu8uMGeDPxL7',
      mobile: '8588005112'
    },
    {
      name: 'Onlybigcars - Thrust Automobile',
      mechanic: 'Jayanth ',
      locality: ' 36/4 , K Narayanpura cross, Bagalur main road, Hennur Gardens, Bengaluru, Karnataka 560077',
      link:' https://maps.app.goo.gl/65mrdNpwpAgQCiDX8?g_st=iw',
      mobile: '7406644647'
    },
    {
      name: 'Onlybigcars - Grace Automobiles',
      mechanic: 'Sonu Sagar',
      locality: 'G62G+5WX New Delhi, Delhi',
      link:'https://maps.app.goo.gl/4La3ZzEv2h9tzVqMA',
      mobile: '99103 18266'
    },
    {
      name: 'Onlybigcars - X Plus auto',
      mechanic: 'Syed Nadeem',
      locality: '388, 7th Block, 1st "A" Cross, Koromangala layout, Bangalore - 560095',
      link:'https://maps.app.goo.gl/ttxRNAFUKAYpKWQy7',
      mobile: '9060786198'
    },
    {
      name: 'Onlybigcars -Sadhna Motors Jahangirpuri ',
      mechanic: 'Rajnish Rajputh',
      locality: 'SSI 45 Rajasthan udyog nagar Jahangirpuri Services - Service & Repairing, AC Service & Repaire, Denting & Painting, Battery, Tyres, Detailing Services, Windshields & Light',
      link:'https://maps.app.goo.gl/sFVZfU2Z6umqC4FA7 ',
      mobile:  '9999152251'
    },
    {
      name: 'Onlybigcars - Company Workshop farmhouse',
      mechanic: 'NA',
      locality: '99Q8+757, Faridabad, Haryana',
      link:'https://maps.app.goo.gl/K93VYqtpJWD6vmmz9',
      mobile: '99999-67591'
    },
    {
      name: 'Onlybigcars - Agra Mathura Road',
      mechanic: 'NA',
      locality: '98V7+C38, Faridabad, Haryana',
      link:'https://maps.app.goo.gl/XUswRwjuf1Xdv1W19',
      mobile: '9999967591'
    },
    {
      name: 'Onlybigcars - 3A Car Service',
      mechanic: 'NA',
      locality: '3A car service, Begur Rd, near St Francis School, Maruthi Layout, Hongasandra, Bengaluru, Karnataka 560068, India',
      link:'https://maps.app.goo.gl/4AsP9DiRgkF3yX3w9',
      mobile: '8123497166'
    },
    {
      name: 'Onlybigcars - Raghav Automobile',
      mechanic: 'Santosh Raghav',
      locality: 'Service & Repairing, AC Service & Repaire, Denting & Painting, Detailing Services, Windshields & Light',
      link:'NA',
      mobile: '7827130743'
    },
    {
      name: 'Onlybigcars - Indo German workshop',
      mechanic: 'Name - Sanjay',
      locality: 'Service & Repairing, AC Service & Repaire, Denting & Painting, Detailing Services, Windshields & Light',
      link:'NA',
      mobile: '9811116043'
    },
    {
      name: 'Onlybigcars - Luxury car care',
      mechanic: 'Dipak ji',
      locality: 'Service & Repairing, AC Service & Repaire, Denting & Painting, Battery, Tyres, Detailing Services, Windshields & Light',
      link:'NA',
      mobile: '9354627795'
    },
    {
      name: 'Onlybigcars - Own',
      mechanic: 'Sahil',
      locality: 'Service & Repairing, AC Service & Repaire, Denting & Painting, Windshields & Light, Battery & Tyres',
      link:'https://g.co/kgs/X7g95w8',
      mobile: '8368092684'
    },
    
  ];

  
  const searchInputRef = useRef(null);
  
  const filteredGarages = modelSearchQuery
    ? garages.filter(garage => 
      garage.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      garage.locality.toLowerCase().includes(modelSearchQuery.toLowerCase())
    )
    : garages;

  const handleSearch = (e) => {
    setModelSearchQuery(e.target.value);
  };

  const handleGarageSelect = (garage)=> {
    onSelectGarage(garage);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-8">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-medium">Select Garage</h2>
          <button className="text-white hover:text-gray-200" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
        <input
          ref={searchInputRef}
          type="text"
          value={modelSearchQuery}
          onChange={handleSearch}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Type to search garages..."
        />
          
          <div className="bg-blue-50 p-2 mb-4 mt-4 rounded">
            <p className="text-gray-700">Recommended As Per Nearest Location</p>
          </div>
          
          <div className="space-y-4 mt-4">
            {filteredGarages.length > 0 ? (
              filteredGarages.map((garage, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4"
                onClick={()=> handleGarageSelect(garage)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-700 font-medium mb-2">{garage.name}</h3>
                      <p className="text-sm text-gray-600">Locality : {garage.locality}</p>
                      <p className="text-sm text-gray-600">
                        Mechanic Name:{garage.mechanic},
                        Garage Mobile : {garage.mobile}
                      </p>
                    </div>
                    
                    <a href={garage.link} target='__blank'
                     className="flex items-center text-red-600 hover:text-red-700">
                      <MapPin size={20} />
                      <span className="ml-1">DIRECTIONS</span>
                    </a>
                    
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No matching garages found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageSelector;