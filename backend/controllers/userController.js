import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import NotificationService from "../services/notificationService.js"; // ✅ AJOUT DE L'IMPORT

// Get single user data
export const getUserData = async (request, response) => {
  try {
    const { userId } = request.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return response.json({ success: false, message: "Utilisateur non trouvé" });
    }

    response.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        role: user.role,  
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    response.json({ success: false, message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register new user (côté admin)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà enregistré" });
    }

    // Check if admin already exists in DB
    if (role === "admin") {
      const existingAdmin = await userModel.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({
          message: "Un administrateur existe déjà. Vous ne pouvez pas en inscrire un autre."
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    await newUser.save();

    // ✅ NOTIFICATION POUR NOUVEL UTILISATEUR CRÉÉ PAR ADMIN
    await NotificationService.createUserRegistrationNotification(newUser);
    
    // ✅ NOTIFICATION SYSTÈME
    await NotificationService.createSystemNotification(
      `Nouvel utilisateur créé par admin: ${name} (${email}) - Rôle: ${role}`
    );

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: "L'inscription a échoué", detail: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur existe
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé."
      });
    }

    // Empêcher l'auto-suppression (optionnel)
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas supprimer votre propre compte."
      });
    }

    const userName = user.name;
    const userEmail = user.email;

    // Supprimer l'utilisateur
    await userModel.findByIdAndDelete(id);

    // ✅ NOTIFICATION DE SUPPRESSION
    await NotificationService.createSystemNotification(
      `Utilisateur supprimé: ${userName} (${userEmail})`
    );

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès."
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de l'utilisateur."
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, hasDataAccess } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé."
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur."
        });
      }
    }

    // Sauvegarder les anciennes valeurs pour la notification
    const oldName = user.name;
    const oldEmail = user.email;
    const oldRole = user.role;

    // Préparer les champs à mettre à jour
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (typeof hasDataAccess !== 'undefined') updateFields.hasDataAccess = hasDataAccess;

    // Mettre à jour l'utilisateur
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    // ✅ NOTIFICATION DE MISE À JOUR
    let updateMessage = `Utilisateur mis à jour: ${oldName}`;
    
    if (name && name !== oldName) {
      updateMessage += ` → ${name}`;
    }
    if (email && email !== oldEmail) {
      updateMessage += ` | Email: ${oldEmail} → ${email}`;
    }
    if (role && role !== oldRole) {
      updateMessage += ` | Rôle: ${oldRole} → ${role}`;
    }

    await NotificationService.createSystemNotification(updateMessage);

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès.",
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de l'utilisateur."
    });
  }
};

// Update user data access
export const updateUserDataAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { hasDataAccess } = req.body;

    // Vérifier que le champ hasDataAccess est fourni
    if (typeof hasDataAccess !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Le champ hasDataAccess est requis et doit être un booléen."
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé."
      });
    }

    // Mettre à jour uniquement l'accès aux données
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { hasDataAccess },
      { new: true, runValidators: true }
    ).select("-password");

    // ✅ NOTIFICATION DE CHANGEMENT D'ACCÈS
    await NotificationService.createSystemNotification(
      `Accès aux données ${hasDataAccess ? 'activé' : 'désactivé'} pour: ${user.name} (${user.email})`
    );

    res.status(200).json({
      success: true,
      message: "Accès aux données mis à jour avec succès.",
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'accès aux données:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de l'accès aux données."
    });
  }
};
// Get users count (simple)
export const getUsersCount = async (req, res) => {
  try {
    const count = await userModel.countDocuments();
    
    res.status(200).json({
      success: true,
      count,
      message: `Total des utilisateurs: ${count}`
    });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors du comptage des utilisateurs" 
    });
  }
};