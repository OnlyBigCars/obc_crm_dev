import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

// Update component props
const AddNewCar = ({ onClose, onSubmit, editingCar }) => {
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);


  // Car data
  const carBrands = [
    "Maruti Suzuki", "Hyundai", "Honda", "Tata", "Ford", "Volkswagen", "Mahindra",
    "Renault", "Chevrolet", "Toyota", "Skoda", "Nissan", "Fiat", "Datsun", "BMW",
    "Kia", "Audi", "Mercedes", "Jeep", "Mitsubishi", "MG", "Land Rover", "Volvo",
    "Jaguar", "Ssangyong", "Isuzu", "Mini", "Force", "Opel", "Porsche", "Daewoo",
    "Hindustan Motors", "Aston Martin", "Citroen", "Lexus", "Bentley", "DC",
    "Ferrari", "Maserati", "Lamborghini", "Rolls Royce", "Photon", "Jayem",
    "Premier", "Hummer", "BYD"
  ];

  const carModelsByBrand = {
    "Maruti Suzuki": ["Swift", "WagonR", "Swift Dzire", "Baleno", "Alto", "Ritz", "Celerio", "Ciaz", "Alto K10", "Ertiga", "Alto 800", "Vitara Brezza", "Estilo", "SX4", "800", "Zen", "A-Star", "Ignis", "S-Cross", "Eeco", "Esteem", "Omni", "S-Presso", "Grand Vitara", "Gypsy", "Kizashi", "Versa", "XL6", "New Grand Vitara", "Invicto", "Jimny", "Fronx"],
    "Hyundai": ["i10", "i20", "Grand i10", "Santro Xing", "Eon", "Xcent", "Elite i20", "Creta", "Alcazar", "Verna Fluidic", "Verna", "Accent", "Santro", "i20 Active", "Elantra", "Getz", "Venue", "Grand i10 Nios", "Verna Transform", "Getz Prime", "Kona", "Accent Viva", "SantaFE", "Tucson", "Sonata", "Sonata Embera", "Aura", "Sonata Transform", "Venue N Line", "i20 N Line", "Exter"],
    "Honda": [
        "City IVTEC",
        "Amaze",
        "City",
        "Brio",
        "Jazz",
        "Civic",
        "Accord",
        "City ZX",
        "WRV",
        "Mobilio",
        "City IDTEC",
        "CRV",
        "BRV",
        "Accord Hybrid",
        "Elevate"
      ],
      "Tata": [
        "Tiago",
        "Tiago NRG",
        "Nano",
        "Zest",
        "Nexon",
        "Indica Vista",
        "Tigor",
        "Manza",
        "Indica",
        "Indigo",
        "Safari",
        "Indigo eCS",
        "Indica V2",
        "Bolt",
        "Indigo CS",
        "Safari Storme",
        "Nano Genx",
        "Indica eV2",
        "Altroz",
        "Aria",
        "Harrier",
        "Hexa",
        "Sumo Grande",
        "Indigo Marina",
        "Sumo Gold",
        "Sumo Grande MK II",
        "Venture",
        "Indigo XL",
        "Sumo Spacio",
        "Winger",
        "Xenon",
        "Sumo Victa",
        "Punch"
      ],
    "Ford": [
        "Figo",
        "Eco Sport",
        "Figo Aspire",
        "Fiesta",
        "Fiesta Classic",
        "Ikon",
        "Endeavour",
        "Freestyle",
        "Fusion",
        "Escort",
        "Mondeo",
        "Mustang"
      ],
    "Volkswagen": [
        "Polo",
        "Vento",
        "Ameo",
        "Cross Polo",
        "Jetta",
        "Passat",
        "Taigun",
        "T-Roc",
        "Beetle",
        "Tiguan",
        "Virtus",
        "Phaeton"
      ],
    "Mahindra": [
        "XUV 500",
        "Scorpio",
        "KUV 100",
        "Xylo",
        "TUV 300",
        "Bolero Neo",
        "Quanto",
        "Bolero",
        "Imperio ",
        "Logan",
        "Verito",
        "XUV 300",
        "Thar",
        "Bolero Camper",
        "NuvoSport",
        "Marazzo",
        "XUV 700",
        "Verito Vibe CS",
        "Bolero Pickup",
        "Scorpio Getaway",
        "Alturas G4",
        "E20 Plus",
        "TUV 300 Plus",
        "Scorpio N",
        "Reva"
      ],
    "Renault": [
        "Kwid",
        "Duster",
        "Scala",
        "Pulse",
        "Fluence",
        "Triber",
        "Lodgy",
        "Captur",
        "Koleos",
        "Kiger"
      ],
    "Chevrolet": [
        "Beat",
        "Spark",
        "Cruze",
        "Aveo",
        "Sail",
        "Enjoy",
        "UVA",
        "Optra",
        "Sail Hatchback",
        "Optra Magnum",
        "Tavera",
        "Optra SRV",
        "Captiva",
        "Forester",
        "Trailblazer"
      ],
    "Toyota": [
        "Sera",
        "Etios",
        "Innova",
        "Corolla Altis",
        "Etios Liva",
        "Fortuner",
        "Hilux",
        "Innova Crysta",
        "Corolla",
        "Qualis",
        "Etios Cross",
        "Yaris",
        "Camry",
        "Glanza",
        "Land Cruiser",
        "Land Cruiser Prado",
        "Urban Cruiser",
        "Alphard",
        "Vellfire",
        "Urban Cruiser Hyryder",
        "Innova Hycross"
      ],
    "Skoda": [
        "Rapid",
        "Fabia",
        "Superb",
        "Laura",
        "Octavia",
        "Yeti",
        "Fabia Scout",
        "Kodiaq",
        "Kushaq",
        "Slavia"
      ],
    "Nissan": [
        "Micra",
        "Sunny",
        "Terrano",
        "Micra Active",
        "Teana",
        "Kicks",
        "Evalia",
        "X-Trail",
        "GTR",
        "Magnite"
      ],
    "Fiat": [
        "Punto",
        "Linea",
        "Punto Evo",
        "Palio D",
        "Avventura",
        "Palio Stile",
        "Linea Classic",
        "Adventure",
        "Palio NV",
        "Abarth Punto",
        "Urban Cross",
        "Uno",
        "Petra"
      ],
    "Datsun": [
        "Redi Go",
        "GO",
        "GO Plus"
      ],
    "BMW": [
        "X1",
        "3 Series",
        "2 Series",
        "5 Series",
        "3 Series GT",
        "X3",
        "7 Series",
        "1 Series",
        "Z4",
        "5 Series GT",
        "X5",
        "X6",
        "6 Series",
        "M5",
        "M3",
        "X4",
        "6 Series GT",
        "X7",
        "i4",
        "iX"
      ],
    "Kia": [
        "Carnival",
        "Seltos",
        "Carens",
        "Sonet",
        "EV6"
      ],
    "Audi": [
        "A4",
        "A6",
        "Q3",
        "Q2",
        "Q7",
        "A3",
        "Q5",
        "A8 L",
        "S4",
        "A5",
        "A7",
        "A8",
        "TT",
        "R8",
        "RS5",
        "RS3",
        "Q8",
        "e-tron"
      ],
    "Mercedes": [
        "C-Class",
        "E-Class",
        "GLC",
        "CLA Class",
        "A-Class",
        "S-Class",
        "V-Class",
        "ML Class",
        "B-Class",
        "GLA Class",
        "GLE Class",
        "SL 500 AMG",
        "AMG GT",
        "G63 AMGr",
        "GL Class",
        "SLK Class",
        "CLS Class",
        "GLS",
        "R Class",
        "GLE43 AMG",
        "EQC",
        "EQS"
      ],
    "Jeep": [
        "Jeep-compass",
        "Jeep-wrangler"
    ],
    "Mitsubishi": [
        "Pajero Sport",
        "Outlander",
        "Pajero",
        "Lancer",
        "Cedia",
        "Montero"
      ],
    "MG": [
        "Gloster",
        "ZS EV",
        "Hector",
        "Astor",
        "Hector Plus"
      ],
    "Land Rover": [
        "Discovery Sport",
        "Range Rover Evoque",
        "Freelander 2",
        "Range Rover Sport",
        "Discovery 4",
        "Defender",
        "Range Rover",
        "Range Rover Vogue",
        "Range Rover Velar"
      ],
    "Volvo": [
        "S60",
        "V40",
        "S80",
        "XC60",
        "XC90",
        "S60 Cross Country",
        "V40 Cross Country",
        "S40",
        "XC 40",
        "V60",
        "V90",
        "S90"
      ],
    "Jaguar": [
        "XF",
        "XE",
        "XJ",
        "F Type",
        "F Pace",
        "XJR",
        "XK R",
        "I-Pace",
        "XJ L"
      ],
    "Ssangyong": [
        "Rexton"
    ],
    "Isuzu": [
        "MU7",
        "Dmax V Cross",
        "MU-X"
      ],
    "Mini": [
        "Cooper",
        "Countryman",
        "Clubman",
        "Cooper SE"
      ],
    "Force": [
        "One",
        "Traveller 3350",
        "Trax",
        "Gurkha"
      ],
    "Opel": [
        "Corsa",
        "Astra"
      ],
    "Porsche": [
        "911",
        "Cayenne",
        "Macan",
        "Cayman",
        "Panamera",
        "Boxter",
        "Taycan",
        "Taycan Turismo"
      ],
    "Daewoo": [
        "Matiz",
        "Nexia",
        "Cielo"
      ],
    "Hindustan Motors": [
        "Ambassador"
      ],
    "Aston Martin": [
        "Vantage",
        "Rapide",
        "Vanquish",
        "DB9"
      ],
    "Citroen": [
        "C5 Aircross",
        "C3"
      ],
    "Lexus": [
        "ES",
        "NX",
        "LS",
        "RX",
        "LC",
        "LX"
      ],
    "Bentley": [
        "Mulsanne",
        "Continental",
        "Flying Spur"
      ],
    "DC": [
        "Avanti"
      ],
    "Ferrari": [
        "458 Speciale",
        "458 Italia",
        "488",
        "California",
        "F12 Berlinetta",
        "FF"
      ],
    "Maserati": [
        "Ghibli",
        "Quattroporte",
        "GranCabrio",
        "GranTurismo"
      ],
    "Lamborghini": [
        "Huracan",
        "Aventador",
        "Gallardo",
        "Urus"
      ],
    "Rolls Royce": [
        "Phantom",
        "Ghost",
        "Wraith"
      ],
    "Photon": [
        "VIW CS2"
      ],
    "Jayem": [
        "Neo"
      ],
    "Premier": [
        "Rio"
    ],
    "Hummer": [
        "H2",
        "H3"
    ],
    "BYD": [
        "e6"
    ]
    // ... (remaining brands and models as per your JSON)
  };

  // Create a reverse lookup map from model to brand
  const modelToBrand = {};
  Object.entries(carModelsByBrand).forEach(([brand, models]) => {
    models.forEach(model => {
      modelToBrand[model] = brand;
    });
  });

  // Get all models across all brands
  const allModels = Object.values(carModelsByBrand).flat();
  
  // Initialize form with editing car data if available
  const [formData, setFormData] = useState({
    carBrand: editingCar?.carBrand || '',
    carModel: editingCar?.carModel || '',
    fuel: editingCar?.fuel || '',
    year: editingCar?.year || '',
    chasisNo: editingCar?.chasisNo || '',
    regNo: editingCar?.regNo || '',
    variant: editingCar?.variant || ' '
  });

  // const [carModels, setCarModels] = useState([]);
  // const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState('');

  // Filter models based on search query
  const filteredModels = allModels.filter(model => 
    model.toLowerCase().startsWith(modelSearchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const selectBrand = (brand) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     carBrand: brand,
  //     // Don't reset carModel when brand is selected
  //   }));
  //   setIsBrandOpen(false);
  // };

  const selectModel = (model) => {
    const correspondingBrand = modelToBrand[model];
    setFormData(prev => ({
      ...prev,
      carModel: model,
      carBrand: correspondingBrand // Automatically set the brand
    }));
    setIsModelOpen(false);
    setModelSearchQuery(''); // Clear search query after selection
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isModelOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isModelOpen]);

  const handleModelSearchClick = () => {
    setIsModelOpen(!isModelOpen);
    // Focus search input when opening
    if (!isModelOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.carBrand || !formData.carModel || !formData.year) {
      alert('Please fill in all required fields');
      return;
    }

    // Pass the form data to parent component
    onSubmit(formData, !!editingCar);
    
    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '20px' }}>
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 p-4 flex justify-between items-center rounded-t-lg sticky top-0 z-10">
          <h2 className="text-white text-lg font-medium">Add New Car</h2>
          <button className="text-white hover:text-gray-200" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Car Brand Dropdown */}
            <div className="flex flex-col relative">
  <label className="text-sm text-gray-600 mb-1">Car Brand *</label>
  <input
    type="text"
    value={formData.carBrand}
    className="p-3 border border-gray-300 rounded-lg bg-gray-50"
    placeholder="Brand will be set automatically"
    readOnly
  />
</div>
            {/* Car Model Dropdown with Search */}
            <div className="flex flex-col relative">
              <label className="text-sm text-gray-600 mb-1">Car Model *</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center bg-white"
                  onClick={handleModelSearchClick}
                >
                  <span className="text-gray-700">
                    {formData.carModel || 'Select Car Model'}
                  </span>
                  <ChevronDown size={20} className="text-gray-500" />
                </button>
                {isModelOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={modelSearchQuery}
                          onChange={(e) => setModelSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Search car model..."
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredModels.length > 0 ? (
                        filteredModels.map((model) => (
                          <button
                            key={model}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => selectModel(model)}
                          >
                            {model}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No models found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of the form remains unchanged */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Fuel Type *</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Year *</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter Year (e.g., 2022)"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Chassis No.</label>
              <input
                type="text"
                name="chasisNo"
                value={formData.chasisNo}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter Chassis Number"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Reg No.</label>
              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter Registration Number"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCar;


