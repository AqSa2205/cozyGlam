const Service = require("../models/services");
const Appointment = require("../models/appointments");
const response = require("../utils/responseHelpers");

module.exports.createService = async (req, res) => {
  try {
    const newServiceObj = req.body;
    const newService = new Service(newServiceObj);
    await newService.save();
    return response.success(res, "Service created successfully", {
      newService,
    });
  } catch (error) {
    return response.serverError(res, "An error occurred", error);
  }
};

module.exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    return response.success (res, "Services fetched sucessfully", {services});
  } catch (error) {
    return response.serverError(res, "Something went wrong", error);
  }
};

exports.updateServiceName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return response.badRequest(res, "Service name is required");
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!service) {
      return response.notFound(res, "Service not found");
    }

    return response.success(res, "Service name updated successfully", {
      service,
    });
  } catch (error) {
    return response.serverError(res, "An error occurred", error);
  }
};

// create appointment 
module.exports.createAppointment = async (req, res) => {
  try {
    
    const { name, email, phone, serviceId, appointmentTime, notes } = req.body;

    if (!name || !email || !phone || !serviceId || !appointmentTime) {
      return response.badRequest(res, "Missing required fields");
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return response.notFound(res, "Service not found");
    }
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      serviceId,
      appointmentTime,
      notes,
    });

    await newAppointment.save();

    return response.success(res, "Successfully applied for appointment", {newAppointment});
  } catch (error) {
    console.log(error)
    return response.serverError(res, "An error occurred", error);
  }
};
//get serivce appointment 
module.exports.getAppointmentsWithService = async (req, res) => {
  try {
    const appointments = await Appointment.aggregate([
      {
        $lookup: {
          from: 'services', // Name of the Service collection
          localField: 'serviceId',
          foreignField: '_id',
          as: 'serviceDetails',
        },
      },
      {
        $unwind: '$serviceDetails', // Unwind to deconstruct the array returned by $lookup
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          appointmentTime: 1,
          notes: 1,
          service: '$serviceDetails'
        },
      },
    ]);

    return response.success(res, "Appointments retrieved successfully", {
      appointments,
    });
  } catch (error) {
    return response.serverError(res, "An error occurred", error);
  }
};
