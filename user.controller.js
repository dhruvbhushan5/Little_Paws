const Pet = require('../models/pets.model');
const Shelter = require('../models/shelter.model')
const {imageUploadUtil} = require('../helpers/cloudinary')
const AdoptionForm = require('../models/adoptionForm.model')
const sendAdoptionApplication = require('../helpers/kafkaProducer')

const enrichUserApplication = async (application) => {
  const pet = application.pet ? await Pet.findById(application.pet) : null;
  const shelter = pet?.shelter ? await Shelter.findById(pet.shelter) : await Shelter.findOne({ city: application.city });

  return {
    ...application,
    petDetails: pet,
    shelterDetails: shelter,
  };
};

const enrichReportedPet = async (pet) => {
  const shelter = pet?.shelter ? await Shelter.findById(pet.shelter) : null;

  return {
    ...pet,
    shelterDetails: shelter,
  };
};

const reportStray =  async (req, res) => {
    try {
      const { name, type, breed, description, age, city, distanceFromChandigarhKm } = req.body;
  
      
      if (!name || !type || !breed || !city || !age || distanceFromChandigarhKm === undefined) {
        return res.status(400).json({ message: "All required fields must be filled" });
      }

      const parsedDistance = Number(distanceFromChandigarhKm);
      if (Number.isNaN(parsedDistance) || parsedDistance < 0) {
        return res.status(400).json({ message: "Distance from Chandigarh must be a valid number." });
      }

      const normalizedCity = String(city).trim();
      let shelter =
        (await Shelter.findOne({ city: normalizedCity })) ||
        (await Shelter.findOne({ city: "Chandigarh" }));
      if (!shelter) {
        return res.status(404).json({ message: "Shelter not found for the selected city" });
      }

      const pickupEligible = parsedDistance <= 40;
      const pickupMessage = pickupEligible
        ? "Pickup is available because your location is within 40 km of Chandigarh."
        : "Please bring the animal to the nearest center because your location is more than 40 km from Chandigarh.";
  
      
      const uploadedPictures = [];
      if (req.files) {
        for (const file of req.files) {
          const fileData = file.buffer.toString("base64");
          const uploadResult = await imageUploadUtil(`data:${file.mimetype};base64,${fileData}`);
          uploadedPictures.push(uploadResult.secure_url);
        }
      }
  
      
      const newPet = new Pet({
        name,
        type,
        breed,
        description,
        age,
        region: normalizedCity,
        distanceFromChandigarhKm: parsedDistance,
        pickupEligible: pickupEligible ? 1 : 0,
        pickupMessage,
        pictures: uploadedPictures,
        shelter: shelter._id, 
        foster: req.user.id, 
        reportStatus: "pending",
        reportSeenAt: null,
      });
  
      
      await newPet.save();
  
    
      res.status(201).json({
        message: "Stray animal reported successfully",
        pet: newPet,
        pickupEligible,
        pickupMessage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error reporting stray animal", error: error.message });
    }
  }

const getReportedStrays = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const reportedPets = await Pet.find({ foster: userId });

    res.status(200).json({
      success: true,
      message: reportedPets.length
        ? "Reported stray animals retrieved successfully."
        : "No stray animal reports found for this user.",
      reports: await Promise.all(reportedPets.map(enrichReportedPet)),
    });
  } catch (error) {
    console.error("Error fetching stray reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stray reports.",
      error: error.message,
    });
  }
}

const getApplicationStatus = async (req, res) => {
  try {
    const { id: userId } = req.user; 

    
    const adoptionForms = await AdoptionForm.find({ user: userId });

    res.status(200).json({
      success: true,
      message: adoptionForms.length
        ? "Adoption applications retrieved successfully."
        : "No adoption applications found for this user.",
      applications: await Promise.all(adoptionForms.map(enrichUserApplication)),
    });
  } catch (error) {
    console.error("Error fetching adoption applications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching adoption applications.",
      error: error.message,
    });
  }
}

// const sendForm = async (req, res) => {
//   try {
//     const { petId } = req.params;
//     const { id: userId } = req.user; 
   
    
//     const { 
//       city, 
//       personalInfo, 
//       livingConditions, 
//       petExperience, 
//       adoptionDetails 
//     } = req.body;

   
//     const pet = await Pet.findById(petId);
//     if (!pet) {
//       return res.status(404).json({ success: false, message: "Pet not found" });
//     }


//     console.log(userId , petId);
    
//     const existingForm = await AdoptionForm.findOne({ user: userId, pet: petId });
//     console.log(existingForm);
//     if (existingForm) {
//       return res.status(400).json({ success: false, message: "You have already submitted an adoption form for this pet." });
//     }

    
//     const adoptionForm = new AdoptionForm({
//       user: userId,
//       pet: petId,
//       city,
//       personalInfo,
//       livingConditions,
//       petExperience,
//       adoptionDetails,
//     });

    
//     const savedForm = await adoptionForm.save();

    
//     res.status(201).json({
//       success: true,
//       message: "Adoption form submitted successfully.",
//       adoptionForm: savedForm,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error submitting adoption form.", error: error.message });
//   }
// }
const sendForm = async (req, res) => {
  try {
    const { petId } = req.params;
    const { id: userId } = req.user; 
   
    const { 
      city, 
      personalInfo, 
      livingConditions, 
      petExperience, 
      adoptionDetails 
    } = req.body;

   
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    console.log(userId, petId);

    
    const existingForm = await AdoptionForm.findOne({ user: userId, pet: petId });
    console.log(existingForm);
    if (existingForm) {
      return res.status(400).json({ success: false, message: "You have already submitted an adoption form for this pet." });
    }

   
    const adoptionForm = new AdoptionForm({
      user: userId,
      pet: petId,
      city: city || pet.region,
      personalInfo,
      livingConditions,
      petExperience,
      adoptionDetails,
    });

    
    const savedForm = await adoptionForm.save();

   
    await sendAdoptionApplication(savedForm);

    
    res.status(201).json({
      success: true,
      message: "Adoption form submitted successfully.",
      adoptionForm: savedForm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error submitting adoption form.", error: error.message });
  }
};

module.exports = {reportStray , getApplicationStatus , getReportedStrays, sendForm}  
