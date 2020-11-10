// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');

const now = new Date();

const uuids = {
  spec: [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()],
  unit: [uuidv4()],
};

module.exports = {
  up: async (QueryInterface) => {
    const specialties = [
      {
        id: uuids.spec[0],
        name: 'MEDICINA INTERNA_',
        display_name: 'Clínico Geral',
        base_price: 150.0,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuids.spec[1],
        name: 'ODONTOLOGIA_',
        display_name: 'Dentista',
        base_price: 170.52,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuids.spec[2],
        name: 'ODONTOLOGIA_',
        display_name: 'Ortodontista',
        base_price: 185.0,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuids.spec[3],
        name: 'PSICOLOGIA_',
        display_name: 'Psicólogo',
        base_price: 145.0,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuids.spec[4],
        name: 'OFTALMOLOGIA_',
        display_name: 'Oftalmologista',
        base_price: 162.0,
        created_at: now,
        updated_at: now,
      },
    ];
    const units = [
      {
        id: uuids.unit[0],
        name: 'UNIDADE SANTA CRUZ_',
        cep: '23555041',
        complements: 'nº 123',
        created_at: now,
        updated_at: now,
      },
    ];
    const doctors = [
      {
        id: uuidv4(),
        name: 'Nicolas Araújo Rocha',
        document: 'CRM 273X01 RJ',
        spec_id: uuids.spec[0],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Anthony Ferreira Assunção',
        document: 'CRO 147X3 RJ',
        spec_id: uuids.spec[1],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Letícia Lopes da Costa',
        document: 'CRO 146X98 RJ',
        spec_id: uuids.spec[2],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Luna Caleb Oliveira',
        document: 'CRO 093X52 RJ',
        spec_id: uuids.spec[2],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Roberto Santiago Garcia da Costa',
        document: 'CRM 994X90 RJ',
        spec_id: uuids.spec[0],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Carlos Ribeiro Carvalho',
        document: 'CRP 451X9 RJ',
        spec_id: uuids.spec[3],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Amanda Pessoa Vieira',
        document: 'CRP 617X8 RJ',
        spec_id: uuids.spec[3],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Fernando da Silva Álvares',
        document: 'CRM 211X24 RJ',
        spec_id: uuids.spec[4],
        unit_id: uuids.unit[0],
        created_at: now,
        updated_at: now,
      },
    ];
    const spec_units = [
      {
        unit_id: uuids.unit[0],
        spec_id: uuids.spec[0],
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: uuids.unit[0],
        spec_id: uuids.spec[1],
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: uuids.unit[0],
        spec_id: uuids.spec[2],
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: uuids.unit[0],
        spec_id: uuids.spec[3],
        created_at: now,
        updated_at: now,
      },
      {
        unit_id: uuids.unit[0],
        spec_id: uuids.spec[4],
        created_at: now,
        updated_at: now,
      },
    ];
    await QueryInterface.bulkInsert('specialties', specialties);
    await QueryInterface.bulkInsert('units', units);
    await QueryInterface.bulkInsert('spec_units', spec_units);
    await QueryInterface.bulkInsert('doctors', doctors);
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.bulkDelete('doctors');
    await QueryInterface.bulkDelete('spec_units');
    await QueryInterface.bulkDelete('units');
    await QueryInterface.bulkDelete('specialties');
  },
};
