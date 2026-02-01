const ContactoMensaje = require("../../../domain/entities/contactoMensaje");

class CreateContactoMensajeUseCase {
  constructor(contactoMensajeRepo) {
    this.contactoMensajeRepo = contactoMensajeRepo;
  }
  async execute(data) {
    // Instanciar ContactoMensaje para asegurar valores por defecto
    const contactoMensaje = new ContactoMensaje(data);
    return await this.contactoMensajeRepo.create(contactoMensaje);
  }
}

class GetContactoMensajesUseCase {
  constructor(contactoMensajeRepo) {
    this.contactoMensajeRepo = contactoMensajeRepo;
  }
  async execute() {
    return await this.contactoMensajeRepo.findAll();
  }
}

class GetContactoMensajeByIdUseCase {
  constructor(contactoMensajeRepo) {
    this.contactoMensajeRepo = contactoMensajeRepo;
  }
  async execute(id) {
    return await this.contactoMensajeRepo.findById(id);
  }
}

class UpdateContactoMensajeUseCase {
  constructor(contactoMensajeRepo) {
    this.contactoMensajeRepo = contactoMensajeRepo;
  }
  async execute(id, data) {
    return await this.contactoMensajeRepo.update(id, data);
  }
}

class DeleteContactoMensajeUseCase {
  constructor(contactoMensajeRepo) {
    this.contactoMensajeRepo = contactoMensajeRepo;
  }
  async execute(id) {
    return await this.contactoMensajeRepo.delete(id);
  }
}

module.exports = {
  CreateContactoMensajeUseCase,
  GetContactoMensajesUseCase,
  GetContactoMensajeByIdUseCase,
  UpdateContactoMensajeUseCase,
  DeleteContactoMensajeUseCase,
};
