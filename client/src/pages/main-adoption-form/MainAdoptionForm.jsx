// //MainAdoptionForm
// import React, { useState } from 'react';
// import { Heart, User, ChevronDown,Check, AlertCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const MainAdoptionForm = () => {
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: '',
//       email: '',
//       phone: '',
//       altPhone: '',
//       address: '',
//       occupation: '',
//       workingHours: '',
//     },
//     livingConditions: {
//       residenceType: '',
//       ownershipStatus: '',
//       hasYard: false,
//       yardFenced: false,
//       householdMembers: '',
//       childrenAges: '',
//       landlordContact: '',
//       moveFrequency: '',
//     },
//     petExperience: {
//       currentPets: '',
//       previousPets: '',
//       vetName: '',
//       vetContact: '',
//       petAllergies: '',
//       trainingExperience: '',
//     },
//     adoptionDetails: {
//       petName: '',
//       reasonToAdopt: '',
//       timeWithPet: '',
//       exercisePlan: '',
//       emergencyPlan: '',
//       adjustmentPlan: '',
//       petExpenses: '',
//       vacationPlan: '',
//     }
//   });

//   const validateField = (value, rules = {}) => {
//     if (rules.required && !value) return 'This field is required';
//     if (rules.email && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address';
//     if (rules.phone && !/^\+?[\d\s-]{10,}$/.test(value)) return 'Invalid phone number';
//     return '';
//   };

//   const handleInputChange = (section, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));

//     setTouched(prev => ({
//       ...prev,
//       [`${section}.${field}`]: true
//     }));

//     validateField(value);
//   };

//   const handleBlur = (section, field, rules) => {
//     const error = validateField(formData[section][field], rules);
//     setErrors(prev => ({
//       ...prev,
//       [`${section}.${field}`]: error
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     let hasErrors = false;
//     let newErrors = {};

//     // Validate all required fields
//     Object.entries(formData).forEach(([section, fields]) => {
//       Object.entries(fields).forEach(([field, value]) => {
//         const error = validateField(value, { required: true });
//         if (error) {
//           hasErrors = true;
//           newErrors[`${section}.${field}`] = error;
//         }
//       });
//     });

//     setErrors(newErrors);

//     if (!hasErrors) {
//       console.log('Form submitted:', formData);
//     } else {
//       alert('Please fill in all required fields correctly.');
//     }
//   };

//   const FormSection = ({ title, children }) => (
//     <div className="mb-8">
//       <h2 className="text-xl font-semibold text-indigo-400 mb-4">{title}</h2>
//       <div className="space-y-4">
//         {children}
//       </div>
//     </div>
//   );

//   const InputField = ({ 
//     label, 
//     type = "text", 
//     value, 
//     onChange, 
//     onBlur,
//     placeholder = "", 
//     required = true,
//     error,
//     touched,
//     hint
//   }) => (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       {type === "textarea" ? (
//         <textarea
//           className={`w-full px-3 py-2 border ${error && touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]`}
//           value={value}
//           onChange={onChange}
//           onBlur={onBlur}
//           placeholder={placeholder}
//           required={required}
//         />
//       ) : (
//         <input
//           type={type}
//           className={`w-full px-3 py-2 border ${error && touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//           value={value}
//           onChange={onChange}
//           onBlur={onBlur}
//           placeholder={placeholder}
//           required={required}
//         />
//       )}
//       {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
//       {error && touched && (
//         <p className="mt-1 text-sm text-red-500 flex items-center">
//           <AlertCircle className="w-4 h-4 mr-1" />
//           {error}
//         </p>
//       )}
//     </div>
//   );

//   return (
//     <div>
//         <nav className="bg-indigo-900 text-white p-4 shadow-lg">
//         <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold">🐾 LilPaws</Link>
//           <div className="flex items-center gap-6">
//           <Link to="/search" className="hover:text-gray-200 font-semibold">Continue Search</Link>
//             <Heart className="w-6 h-6 hover:text-indigo-200 cursor-pointer" />
//             <User className="w-6 h-6 hover:text-indigo-200 cursor-pointer" />
//           </div>
//         </div>
//       </nav>
//     <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pet Adoption Application</h1>
      
//       <FormSection title="Personal Information">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField
//             label="Full Name"
//             value={formData.personalInfo.fullName}
//             onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
//             onBlur={() => handleBlur('personalInfo', 'fullName', { required: true })}
//             placeholder="Enter your full legal name"
//             error={errors['personalInfo.fullName']}
//             touched={touched['personalInfo.fullName']}
//           />
//           <InputField
//             label="Email"
//             type="email"
//             value={formData.personalInfo.email}
//             onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
//             onBlur={() => handleBlur('personalInfo', 'email', { required: true, email: true })}
//             placeholder="your.email@example.com"
//             error={errors['personalInfo.email']}
//             touched={touched['personalInfo.email']}
//           />
//           <InputField
//             label="Primary Phone"
//             type="tel"
//             value={formData.personalInfo.phone}
//             onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
//             onBlur={() => handleBlur('personalInfo', 'phone', { required: true, phone: true })}
//             placeholder="+1 (555) 000-0000"
//             error={errors['personalInfo.phone']}
//             touched={touched['personalInfo.phone']}
//             hint="Include country code and area code"
//           />
//           <InputField
//             label="Alternative Phone"
//             type="tel"
//             required={false}
//             value={formData.personalInfo.altPhone}
//             onChange={(e) => handleInputChange('personalInfo', 'altPhone', e.target.value)}
//             placeholder="Optional secondary contact"
//             hint="Emergency contact number recommended"
//           />
//         </div>
//         <InputField
//           label="Complete Address"
//           type="textarea"
//           value={formData.personalInfo.address}
//           onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
//           placeholder="Include street address, apartment number, city, state/province, postal code, and country"
//           error={errors['personalInfo.address']}
//           touched={touched['personalInfo.address']}
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField
//             label="Occupation"
//             value={formData.personalInfo.occupation}
//             onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)}
//             placeholder="Your current job title and employer"
//             error={errors['personalInfo.occupation']}
//             touched={touched['personalInfo.occupation']}
//           />
//           <InputField
//             label="Working Hours"
//             value={formData.personalInfo.workingHours}
//             onChange={(e) => handleInputChange('personalInfo', 'workingHours', e.target.value)}
//             placeholder="e.g., Monday-Friday 9AM-5PM"
//             error={errors['personalInfo.workingHours']}
//             touched={touched['personalInfo.workingHours']}
//             hint="Include regular work schedule and typical hours at home"
//           />
//         </div>
//       </FormSection>

//       <FormSection title="Living Conditions">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField
//             label="Type of Residence"
//             value={formData.livingConditions.residenceType}
//             onChange={(e) => handleInputChange('livingConditions', 'residenceType', e.target.value)}
//             placeholder="House, Apartment, Condo, etc."
//             error={errors['livingConditions.residenceType']}
//             touched={touched['livingConditions.residenceType']}
//           />
//           <InputField
//             label="Ownership Status"
//             value={formData.livingConditions.ownershipStatus}
//             onChange={(e) => handleInputChange('livingConditions', 'ownershipStatus', e.target.value)}
//             placeholder="Own, Rent, Lease, Living with Family"
//             error={errors['livingConditions.ownershipStatus']}
//             touched={touched['livingConditions.ownershipStatus']}
//           />
//         </div>
//         <InputField
//           label="Landlord Contact (if renting)"
//           required={false}
//           value={formData.livingConditions.landlordContact}
//           onChange={(e) => handleInputChange('livingConditions', 'landlordContact', e.target.value)}
//           placeholder="Name and contact information of landlord/property manager"
//           hint="Required if you're renting to verify pet policies"
//         />
//         <InputField
//           label="How often do you move?"
//           value={formData.livingConditions.moveFrequency}
//           onChange={(e) => handleInputChange('livingConditions', 'moveFrequency', e.target.value)}
//           placeholder="e.g., Every few years, Rarely, Never moved in X years"
//           error={errors['livingConditions.moveFrequency']}
//           touched={touched['livingConditions.moveFrequency']}
//         />
//         <InputField
//           label="Number of People in Household"
//           value={formData.livingConditions.householdMembers}
//           onChange={(e) => handleInputChange('livingConditions', 'householdMembers', e.target.value)}
//           placeholder="Include all adults and children"
//           error={errors['livingConditions.householdMembers']}
//           touched={touched['livingConditions.householdMembers']}
//           hint="Specify ages and relationships"
//         />
//       </FormSection>

//       <FormSection title="Pet Experience">
//         <InputField
//           label="Current Pets"
//           type="textarea"
//           required={false}
//           value={formData.petExperience.currentPets}
//           onChange={(e) => handleInputChange('petExperience', 'currentPets', e.target.value)}
//           placeholder="List all current pets: species, breed, age, and temperament"
//           hint="Include their vaccination status and spay/neuter information"
//         />
//         <InputField
//           label="Previous Pet Experience"
//           type="textarea"
//           value={formData.petExperience.previousPets}
//           onChange={(e) => handleInputChange('petExperience', 'previousPets', e.target.value)}
//           placeholder="Describe your experience with previous pets, including what happened to them"
//           error={errors['petExperience.previousPets']}
//           touched={touched['petExperience.previousPets']}
//         />
//         <InputField
//           label="Pet Training Experience"
//           type="textarea"
//           value={formData.petExperience.trainingExperience}
//           onChange={(e) => handleInputChange('petExperience', 'trainingExperience', e.target.value)}
//           placeholder="Describe any experience with pet training, behavioral issues, or special needs pets"
//           error={errors['petExperience.trainingExperience']}
//           touched={touched['petExperience.trainingExperience']}
//         />
//       </FormSection>

//       <FormSection title="Adoption Details">
//         <InputField
//           label="Name of pet you wish to adopt"
//           value={formData.adoptionDetails.petName}
//           onChange={(e) => handleInputChange('adoptionDetails', 'petName', e.target.value)}
//           placeholder="Name of the pet you're interested in"
//           error={errors['adoptionDetails.petName']}
//           touched={touched['adoptionDetails.petName']}
//         />
//         <InputField
//           label="Why do you want to adopt this pet?"
//           type="textarea"
//           value={formData.adoptionDetails.reasonToAdopt}
//           onChange={(e) => handleInputChange('adoptionDetails', 'reasonToAdopt', e.target.value)}
//           placeholder="Explain your motivation for adoption and why you chose this particular pet"
//           error={errors['adoptionDetails.reasonToAdopt']}
//           touched={touched['adoptionDetails.reasonToAdopt']}
//         />
//         <InputField
//           label="Daily Time Commitment"
//           type="textarea"
//           value={formData.adoptionDetails.timeWithPet}
//           onChange={(e) => handleInputChange('adoptionDetails', 'timeWithPet', e.target.value)}
//           placeholder="Describe your daily schedule and how you'll make time for the pet"
//           error={errors['adoptionDetails.timeWithPet']}
//           touched={touched['adoptionDetails.timeWithPet']}
//         />
//         <InputField
//           label="Exercise and Entertainment Plan"
//           type="textarea"
//           value={formData.adoptionDetails.exercisePlan}
//           onChange={(e) => handleInputChange('adoptionDetails', 'exercisePlan', e.target.value)}
//           placeholder="Detail your plans for exercise, play, and mental stimulation"
//           error={errors['adoptionDetails.exercisePlan']}
//           touched={touched['adoptionDetails.exercisePlan']}
//         />
//         <InputField
//           label="Vacation/Travel Plans"
//           type="textarea"
//           value={formData.adoptionDetails.vacationPlan}
//           onChange={(e) => handleInputChange('adoptionDetails', 'vacationPlan', e.target.value)}
//           placeholder="Describe arrangements for pet care during your absence"
//           error={errors['adoptionDetails.vacationPlan']}
//           touched={touched['adoptionDetails.vacationPlan']}
//         />
//         <InputField
//           label="Monthly Pet Budget"
//           value={formData.adoptionDetails.petExpenses}
//           onChange={(e) => handleInputChange('adoptionDetails', 'petExpenses', e.target.value)}
//           placeholder="Estimated monthly budget for food, supplies, vet care, etc."
//           error={errors['adoptionDetails.petExpenses']}
//           touched={touched['adoptionDetails.petExpenses']}
//           hint="Include regular expenses and emergency fund plans"
//         />
//       </FormSection>

//       <button
//         type="submit"
//         className="w-full bg-indigo-900 text-white py-3 px-6 rounded-md hover:bg-indigo-500 transition-colors duration-200 font-medium"
//       >
//         Submit Application
//       </button>
//     </form>
//     </div>
//   );
// };

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainNavbar from '@/components/main-navbar/MainNavbar';

const AdoptionForm = () => {
  const { user } = useSelector(state=>state.auth);
  const { petId } = useParams();
  const [formData, setFormData] = useState({
    city: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      altPhone: '',
      address: '',
      occupation: '',
      workingHours: ''
    },
    livingConditions: {
      residenceType: '',
      ownershipStatus: '',
      hasYard: false,
      yardFenced: false,
      householdMembers: '',
      childrenAges: '',
      landlordContact: '',
      moveFrequency: ''
    },
    petExperience: {
      currentPets: '',
      previousPets: '',
      vetName: '',
      vetContact: '',
      petAllergies: '',
      trainingExperience: ''
    },
    adoptionDetails: {
      petName: '',
      reasonToAdopt: '',
      timeWithPet: '',
      exercisePlan: '',
      emergencyPlan: '',
      adjustmentPlan: '',
      petExpenses: '',
      vacationPlan: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Set a cookie before making the POST request
      document.cookie = "myCookieName=myCookieValue; Path=/;";
  
      // Send adoption application data with credentials
      const response = await axios.post(
        `http://localhost:5000/api/user/adopt/${petId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies and credentials in the request
        }
      );
  
      // Check if the POST request was successful
      if (response.data.success) {
        alert('Application submitted successfully!');
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit application. Please try again.');
      console.log('Form Data:', formData);
    }
  };
  return (<div>
    <MainNavbar/>
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Pet Adoption Application</h1>

        {/* City Information */}
        {/* <div className="mb-6">
          <label className="block mb-2 font-semibold">
            City
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </label>
        </div> */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            City *
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="city"
                value="Chandigarh"
                className="mr-2"
                checked={formData.city === "Chandigarh"}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
              Chandigarh
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="city"
                value="Panchkula"
                className="mr-2"
                checked={formData.city === "Panchkula"}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
              Panchkula
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="city"
                value="Mohali"
                className="mr-2"
                checked={formData.city === "Mohali"}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
              Mohali
            </label>
          </div>
        </div>


        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              Full Name *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                required
              />
            </label>
            <label className="block">
              Email *
              <input
                type="email"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.email}
                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                required
              />
            </label>
            <label className="block">
              Phone *
              <input
                type="tel"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                required
              />
            </label>
            <label className="block">
              Alternative Phone
              <input
                type="tel"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.altPhone}
                onChange={(e) => handleInputChange('personalInfo', 'altPhone', e.target.value)}
              />
            </label>
            <label className="block md:col-span-2">
              Address *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                required
              />
            </label>
            <label className="block">
              Occupation *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.occupation}
                onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)}
                required
              />
            </label>
            <label className="block">
              Working Hours *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.personalInfo.workingHours}
                onChange={(e) => handleInputChange('personalInfo', 'workingHours', e.target.value)}
                required
              />
            </label>
          </div>
        </div>

        {/* Living Conditions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Living Conditions</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-semibold">Residence Type *</p>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="residenceType"
                    value="house"
                    checked={formData.livingConditions.residenceType === 'house'}
                    onChange={(e) => handleInputChange('livingConditions', 'residenceType', e.target.value)}
                    required
                  />
                  House
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="residenceType"
                    value="apartment"
                    checked={formData.livingConditions.residenceType === 'apartment'}
                    onChange={(e) => handleInputChange('livingConditions', 'residenceType', e.target.value)}
                  />
                  Apartment
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold">Ownership Status *</p>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ownershipStatus"
                    value="Own"
                    checked={formData.livingConditions.ownershipStatus === 'Own'}
                    onChange={(e) => handleInputChange('livingConditions', 'ownershipStatus', e.target.value)}
                    required
                  />
                  Own
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="ownershipStatus"
                    value="Rent"
                    checked={formData.livingConditions.ownershipStatus === 'Rent'}
                    onChange={(e) => handleInputChange('livingConditions', 'ownershipStatus', e.target.value)}
                  />
                  Rent
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.livingConditions.hasYard}
                  onChange={(e) => handleInputChange('livingConditions', 'hasYard', e.target.checked)}
                />
                Has Yard
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.livingConditions.yardFenced}
                  onChange={(e) => handleInputChange('livingConditions', 'yardFenced', e.target.checked)}
                />
                Yard is Fenced
              </label>
            </div>

            <label className="block">
              Household Members *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.livingConditions.householdMembers}
                onChange={(e) => handleInputChange('livingConditions', 'householdMembers', e.target.value)}
                required
              />
            </label>

            <label className="block">
              Children Ages (if any)
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.livingConditions.childrenAges}
                onChange={(e) => handleInputChange('livingConditions', 'childrenAges', e.target.value)}
              />
            </label>

            {formData.livingConditions.ownershipStatus === 'Rent' && (
              <label className="block">
                Landlord Contact *
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.livingConditions.landlordContact}
                  onChange={(e) => handleInputChange('livingConditions', 'landlordContact', e.target.value)}
                  required
                />
              </label>
            )}

            <label className="block">
              How often do you move? *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.livingConditions.moveFrequency}
                onChange={(e) => handleInputChange('livingConditions', 'moveFrequency', e.target.value)}
                required
              />
            </label>
          </div>
        </div>

        {/* Pet Experience */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Pet Experience</h2>
          <div className="space-y-4">
            <label className="block">
              Current Pets
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.petExperience.currentPets}
                onChange={(e) => handleInputChange('petExperience', 'currentPets', e.target.value)}
              />
            </label>

            <label className="block">
              Previous Pets *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.petExperience.previousPets}
                onChange={(e) => handleInputChange('petExperience', 'previousPets', e.target.value)}
                required
              />
            </label>

            <label className="block">
              Veterinarian Name
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.petExperience.vetName}
                onChange={(e) => handleInputChange('petExperience', 'vetName', e.target.value)}
              />
            </label>

            <label className="block">
              Veterinarian Contact
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.petExperience.vetContact}
                onChange={(e) => handleInputChange('petExperience', 'vetContact', e.target.value)}
              />
            </label>

            <label className="block">
              Pet Allergies
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.petExperience.petAllergies}
                onChange={(e) => handleInputChange('petExperience', 'petAllergies', e.target.value)}
              />
            </label>

            <label className="block">
              Training Experience *
              <textarea
                className="w-full mt-1 p-2 border rounded"
                value={formData.petExperience.trainingExperience}
                onChange={(e) => handleInputChange('petExperience', 'trainingExperience', e.target.value)}
                required
                rows="3"
              />
            </label>
          </div>
        </div>

        {/* Adoption Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Adoption Details</h2>
          <div className="space-y-4">
            <label className="block">
              Pet Name *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.petName}
                onChange={(e) => handleInputChange('adoptionDetails', 'petName', e.target.value)}
                required
              />
            </label>

            <label className="block">
              Why do you want to adopt this pet? *
              <textarea
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.reasonToAdopt}
                onChange={(e) => handleInputChange('adoptionDetails', 'reasonToAdopt', e.target.value)}
                required
                rows="3"
              />
            </label>

            <label className="block">
              How much time will you spend with the pet? *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.timeWithPet}
                onChange={(e) => handleInputChange('adoptionDetails', 'timeWithPet', e.target.value)}
                required
              />
            </label>

            <label className="block">
              Exercise Plan *
              <textarea
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.exercisePlan}
                onChange={(e) => handleInputChange('adoptionDetails', 'exercisePlan', e.target.value)}
                required
                rows="3"
              />
            </label>

            <label className="block">
              Emergency Plan
              <textarea
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.emergencyPlan}
                onChange={(e) => handleInputChange('adoptionDetails', 'emergencyPlan', e.target.value)}
                rows="3"
              />
            </label>

            <label className="block">
              Adjustment Plan
              <textarea
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.adjustmentPlan}
                onChange={(e) => handleInputChange('adoptionDetails', 'adjustmentPlan', e.target.value)}
                rows="3"
              />
            </label>

            <label className="block">
              Expected Pet Expenses *
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.petExpenses}
                onChange={(e) => handleInputChange('adoptionDetails', 'petExpenses', e.target.value)}
                required
              />
            </label>

            <label className="block">
              Vacation Plan *
              <textarea
                className="w-full mt-1 p-2 border rounded"
                value={formData.adoptionDetails.vacationPlan}
                onChange={(e) => handleInputChange('adoptionDetails', 'vacationPlan', e.target.value)}
                rows="3"
                required
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Submit Application
        </button>
      </div>
    </form>
    </div>
  );
};

export default AdoptionForm;
