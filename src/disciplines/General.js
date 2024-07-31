const General = {
    'General Information': [
        { name: 'Title of the dataset / Titre de la base de données', type: 'small' },
        { name: 'Description', type: 'large' },
        { name: 'Date of data collection / Date de la collecte des données', type: 'small' },
    ],
    'Author Information': [
        { name: 'Name (Last name, name) / Nom (nom de famille, nom)', type: 'small' },
        { name: 'Institution', type: 'small' },
        { name: 'Email / Adresse courriel', type: 'small' },
        { name: 'ORCID ID', type: 'small' },
    ],
    'Methodological Details': [
        { name: 'Methods for data collection / Méthodes de collecte des données', type: 'large', subfields: ['Software / Logiciel', 'Version', 'Purpose / Objectif'] },
        { name: 'Methods for processing the data', type: 'large', subfields: ['Software / Logiciel', 'Version', 'Purpose / Objectif'] },
        { name: 'Enviromental/experimental conditions / Conditions environnementales/expérimentales', type: 'large' },
        { name: 'Contributors / contributeurs', type: 'contributor' }
    ],
    'File Overview / Aperçu du dossier': [
        { name: 'File list / Liste des fichiers', type: 'fileOverview' },
        { name: 'Relationship between files / Relation entre les dossiers', type: 'large' },
        { name: 'Additional related data / Données complémentaires', type: 'additionalRelatedData' }
    ],
    'Sharing and access information / Partage et accès à l\'information': [
        { name: 'Licenses and restrictions for data / Licences et restrictions pour les données', type: 'licence' },
        { name: 'Source and Sensitivity / Source et sensibilité', type: 'sourceSensitivity' },
        { name: 'Recommended citation / Citation recommandée', type: 'recommendedCitation' }
    ]
};

export default General;


