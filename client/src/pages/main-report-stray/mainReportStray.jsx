// //MainReportStray
// import React, { useState } from 'react';
// import { Heart, User, ChevronDown,Check, AlertCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const MainReportStray = () => {
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [formData, setFormData] = useState({
//       pictures: [{ type: String }],
//       name: '',
//       type: '',
//       breed: '',
//       description: '',
//       age: '',
//       region: '',
//       foster: '',
//     });
//     const [images, setImages] = useState([]); // State to hold multiple images

//     const handleImageChange = (e) => {
//         const files = e.target.files; // Get the list of files selected
    
//         if (files.length > 0) {
//           // Convert files to an array and push them to the state
//           const newImages = Array.from(files); // Converts FileList to array
//           setImages((prevImages) => [...prevImages, ...newImages]); // Push the new images into the state
//         }
//     };

//   const validateField = (value, rules = {}) => {
//     if (rules.required && !value) return 'This field is required';
//     if (rules.email && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address';
//     if (rules.phone && !/^\+?[\d\s-]{10,}$/.test(value)) return 'Invalid phone number';
//     return '';
//   };

//   const handleInputChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//         [field]: value,
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
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       alert("Please fix the form errors.");
//       return;
//     }

//     // Set cookies
//     document.cookie = "myCookieName=myCookieValue; Path=/;";

//     // Prepare form data for upload
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("type", formData.type);
//     data.append("breed", formData.breed);
//     data.append("description", formData.description);
//     data.append("age", formData.age);
//     data.append("city", formData.city);

//     images.forEach((image) => {
//       data.append("pictures", image); // Append each image
//     });

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/user/report-stray",
//         data,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data", // Handles file uploads
//           },
//         }
//       );
//       alert(response.data.message || "Stray animal reported successfully!");
//     } catch (error) {
//       console.error("Error reporting stray animal:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Something went wrong.");
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
//     hint,
//     onFileChange
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
//       <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
//   <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pet Details Form</h1>

//   <FormSection title="Basic Information">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <InputField
//         label="Pet Name"
//         value={formData.name}
//         onChange={(e) => handleInputChange('name', e.target.value)}
//         onBlur={() => handleBlur('name', { required: true })}
//         placeholder="Enter pet's name"
//         error={errors.name}
//         touched={touched.name}
//       />
//       <InputField
//         label="Type of Pet"
//         value={formData.type}
//         onChange={(e) => handleInputChange('type', e.target.value)}
//         onBlur={() => handleBlur('type', { required: true })}
//         placeholder="e.g., Dog, Cat, Bird"
//         error={errors.type}
//         touched={touched.type}
//       />
//     </div>
//     <InputField
//       label="Breed"
//       value={formData.breed}
//       onChange={(e) => handleInputChange('breed', e.target.value)}
//       onBlur={() => handleBlur('breed', { required: true })}
//       placeholder="e.g., Golden Retriever, Persian Cat"
//       error={errors.breed}
//       touched={touched.breed}
//     />
//     <InputField
//       label="Description"
//       type="textarea"
//       value={formData.description}
//       onChange={(e) => handleInputChange('description', e.target.value)}
//       placeholder="Brief description about the pet"
//       error={errors.description}
//       touched={touched.description}
//     />
//   </FormSection>

//   <FormSection title="Age and Region">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <InputField
//         label="Age (in years)"
//         type="number"
//         value={formData.age}
//         onChange={(e) => handleInputChange('age', e.target.value)}
//         onBlur={() => handleBlur('age', { required: true, min: 0 })}
//         placeholder="e.g., 3"
//         error={errors.age}
//         touched={touched.age}
//       />
//       <InputField
//         label="Region"
//         value={formData.region}
//         onChange={(e) => handleInputChange('region', e.target.value)}
//         onBlur={() => handleBlur('region', { required: true })}
//         placeholder="e.g., California, Texas"
//         error={errors.region}
//         touched={touched.region}
//       />
//     </div>
//   </FormSection>

//   <FormSection title="Foster Details">
//     <InputField
//       label="Foster User ID"
//       value={formData.foster}
//       onChange={(e) => handleInputChange('foster', e.target.value)}
//       placeholder="Optional: User ID of the foster"
//       error={errors.foster}
//       touched={touched.foster}
//       hint="Leave blank if not applicable"
//     />
//   </FormSection>

//   <FormSection title="Upload Pictures">
//     {/* <InputField
//       label="Pictures (URLs)"
//       type="textarea"
//       value={formData.pictures.join(', ')}
//       onChange={(e) => handleInputChange('pictures', e.target.value.split(',').map((url) => url.trim()))}
//       placeholder="Add picture URLs separated by commas"
//       error={errors.pictures}
//       touched={touched.pictures}
//       hint="Paste URLs of pet pictures"
//     /> */}
//     <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleImageChange}
//       />
      
//       {/* Render all uploaded images */}
//       <div className="image-previews">
//         {images.map((image, index) => (
//           <img key={index} src={image} alt={`Uploaded Preview ${index}`} style={{ width: "200px", height: "auto" }} />
//         ))}
//         </div>
//   </FormSection>

//   <button
//     type="submit"
//     className="w-full bg-indigo-900 text-white py-3 px-6 rounded-md hover:bg-indigo-500 transition-colors duration-200 font-medium"
//   >
//     Submit Pet Details
//   </button>
// </form>

//     </div>
//   );
// };

// export default MainReportStray;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@/components/main-navbar/MainNavbar";
import banner2 from "@/assets/banner2.webp";
import banner4 from "@/assets/banner4.webp";
import banner5 from "@/assets/banner5.webp";

const MainReportStray = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    description: "",
    age: "",
    city: "",
    distanceFromChandigarhKm: "",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const slides = [banner5, banner2, banner4];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Update formData state
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Pet name is required";
    if (!formData.type) newErrors.type = "Pet type is required";
    if (!formData.breed) newErrors.breed = "Breed is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.age || formData.age <= 0) newErrors.age = "Valid age is required";
    if (formData.distanceFromChandigarhKm === "" || Number(formData.distanceFromChandigarhKm) < 0) {
      newErrors.distanceFromChandigarhKm = "Valid distance is required";
    }

    setErrors(newErrors);

    console.error("Validation Errors:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the form errors.");
      console.error("Validation Errors:", errors);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("breed", formData.breed);
    data.append("description", formData.description);
    data.append("age", formData.age);
    data.append("city", formData.city);
    data.append("distanceFromChandigarhKm", formData.distanceFromChandigarhKm);

    images.forEach((image) => {
      data.append("pictures", image);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/user/report-stray", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.pickupMessage || response.data.message || "Stray animal reported successfully!");
      navigate("/applicationStatus");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <MainNavbar />

      <div className="relative px-4 py-12 sm:px-6">
        {slides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.76), rgba(15, 23, 42, 0.76)), url(${slide})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%)]" />
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-12 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        >
        <h1 className="mb-2 text-3xl font-bold text-slate-950">Report a Stray Animal</h1>
        <p className="mb-6 text-sm text-slate-600">
          Share the animal details. Reported animals stay in the shelter workflow and are not added to the public pets page automatically.
        </p>

        <div className="space-y-4">
          {/* Pet Name */}
          <div>
            <label>Pet Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter pet's name"
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          {/* Pet Type */}
          <div>
            <label>Type of Pet</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              placeholder="e.g., Dog, Cat, Bird"
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            {errors.type && <p className="text-red-500">{errors.type}</p>}
          </div>

          {/* Breed */}
          <div>
            <label>Breed</label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => handleInputChange("breed", e.target.value)}
              placeholder="e.g., Golden Retriever"
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            {errors.breed && <p className="text-red-500">{errors.breed}</p>}
          </div>

          {/* City */}
          <div>
            <label>City / Location</label>
            <input
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter your city or area"
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            {errors.city && <p className="text-red-500">{errors.city}</p>}
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="Enter age in years"
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            {errors.age && <p className="text-red-500">{errors.age}</p>}
          </div>

          <div>
            <label>Distance From Chandigarh (km)</label>
            <input
              type="number"
              value={formData.distanceFromChandigarhKm}
              onChange={(e) => handleInputChange("distanceFromChandigarhKm", e.target.value)}
              placeholder="Enter distance in km"
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            {errors.distanceFromChandigarhKm && (
              <p className="text-red-500">{errors.distanceFromChandigarhKm}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              If your location is within 40 km of Chandigarh, our team can arrange pickup. Otherwise, you will need to bring the animal to the assigned center.
            </p>
          </div>


          {/* Images */}
          <div>
            <label>Upload Pictures</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button 
            type="submit" 
            className="rounded-xl bg-sky-600 px-5 py-2.5 font-medium text-white transition hover:bg-sky-700"
          >
            Submit
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default MainReportStray;
