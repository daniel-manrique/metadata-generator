import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.png'; // Assuming you have a logo image named logo.png in the src folder
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const disciplineOptions = ['General', 'Astronomy']; // Add more disciplines 
const roles = ['Collector', 'Processor', 'Analyst']; // Example roles

function App() {
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const [disciplineData, setDisciplineData] = useState({});
    const [formData, setFormData] = useState({});
    const [authorFields, setAuthorFields] = useState([{}]);
    const [contributors, setContributors] = useState([{ role: '', name: '' }]);
    const [softwareFields, setSoftwareFields] = useState({});
    const [fileOverviews, setFileOverviews] = useState([{ type: '', description: '' }]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (selectedDiscipline) {
            import(`./disciplines/${selectedDiscipline}.js`).then(module => {
                setDisciplineData(module.default);
            });
        }
    }, [selectedDiscipline]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setFormData({ ...formData, 'Start Date': date });
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setFormData({ ...formData, 'End Date': date });
    };

    const handleInputChange = (index, field, value) => {
        const newFields = [...authorFields];
        newFields[index][field] = value;
        setAuthorFields(newFields);
        setFormData({ ...formData, [`Author ${index + 1} ${field}`]: value });
    };

    const handleContributorChange = (index, field, value) => {
        const newContributors = [...contributors];
        newContributors[index][field] = value;
        setContributors(newContributors);
        setFormData({ ...formData, [`Contributor ${index + 1} ${field}`]: value });
    };

    const addContributor = () => {
        setContributors([...contributors, { role: '', name: '' }]);
    };

    const removeLastContributor = () => {
        const newContributors = contributors.slice(0, -1);
        setContributors(newContributors);
    };

    const handleSoftwareInputChange = (section, index, subfield, value) => {
        const sectionFields = softwareFields[section] || [];
        const newFields = [...sectionFields];
        newFields[index] = { ...newFields[index], [subfield]: value };
        setSoftwareFields({ ...softwareFields, [section]: newFields });
        setFormData({ ...formData, [`${section} ${index + 1} ${subfield}`]: value });
    };

    const addSoftwareField = (section) => {
        const sectionFields = softwareFields[section] || [];
        setSoftwareFields({ ...softwareFields, [section]: [...sectionFields, {}] });
    };

    const removeLastSoftwareField = (section) => {
        const sectionFields = softwareFields[section] || [];
        setSoftwareFields({ ...softwareFields, [section]: sectionFields.slice(0, -1) });
    };

    const handleFileOverviewChange = (index, field, value) => {
        const newOverviews = [...fileOverviews];
        newOverviews[index][field] = value;
        setFileOverviews(newOverviews);
        setFormData({ ...formData, [`File Overview ${index + 1} ${field}`]: value });
    };

    const addFileOverview = () => {
        setFileOverviews([...fileOverviews, { type: '', description: '' }]);
    };

    const removeLastFileOverview = () => {
        const newOverviews = fileOverviews.slice(0, -1);
        setFileOverviews(newOverviews);
    };

    const handleAdditionalRelatedDataChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const licenceDescriptions = {
        'CC BY': 'Lorem ipsum description for CC BY.',
        'CC BY-SA': 'Lorem ipsum description for CC BY-SA.',
        'CC BY-NC': 'Lorem ipsum description for CC BY-NC.',
        'CC0': 'Lorem ipsum description for CC0.'
    };

    const sourceSensitivityOptions = ['Yes / Oui', 'No / Non'];

    const exportAsTxt = () => {
        let dataStr = "README\n\n";
        Object.keys(disciplineData).forEach(section => {
            dataStr += `${section}\n`;
            disciplineData[section].forEach((field, index) => {
                const key = Object.keys(formData).find(key => key.endsWith(field.name));
                if (field.type === 'contributor') {
                    dataStr += `${index + 1}. ${field.name}\n`;
                    contributors.forEach((contributor, idx) => {
                        dataStr += `    ${idx + 1}. Role: ${contributor.role}\n    Name: ${contributor.name}\n`;
                    });
                } else if (field.subfields) {
                    dataStr += `${index + 1}. ${field.name}\n`;
                    const sectionFields = softwareFields[`${section} ${field.name}`] || [];
                    sectionFields.forEach((softwareField, idx) => {
                        dataStr += `    ${idx + 1}. Software / Logiciel: ${softwareField['Software / Logiciel']}\n    Version: ${softwareField['Version']}\n    Purpose / Objectif: ${softwareField['Purpose / Objectif']}\n`;
                    });
                    if (key) {
                        dataStr += `    ${formData[key]}\n`;
                    }
                } else if (field.type === 'fileOverview') {
                    dataStr += `${index + 1}. ${field.name}\n`;
                    fileOverviews.forEach((overview, idx) => {
                        dataStr += `    ${idx + 1}. Type: ${overview.type}\n    Description: ${overview.description}\n`;
                    });
                } else if (field.type === 'additionalRelatedData') {
                    dataStr += `${index + 1}. ${field.name}\n`;
                    dataStr += `    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lacinia nisl odio, eget hendrerit eros varius sit amet. Donec at convallis erat. Aenean nec diam nec metus commodo fermentum. Vivamus vel fringilla odio, non condimentum ligula.\n`;
                    dataStr += `    ${formData[field.name] || ''}\n`;
                } else {
                    if (key) {
                        dataStr += `${index + 1}. ${field.name}\n    ${formData[key]}\n`;
                    }
                }
            });
            dataStr += '\n';
        });
        const blob = new Blob([dataStr], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'readme.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportAsJson = () => {
        const jsonOutput = {};
        Object.keys(disciplineData).forEach(section => {
            jsonOutput[section] = {};
            disciplineData[section].forEach((field, index) => {
                if (field.type === 'contributor') {
                    jsonOutput[section][`${index + 1}. ${field.name}`] = contributors.map((contributor, idx) => ({
                        [`${idx + 1}. Role`]: contributor.role,
                        [`Name`]: contributor.name
                    }));
                } else if (field.subfields) {
                    const sectionFields = softwareFields[`${section} ${field.name}`] || [];
                    jsonOutput[section][`${index + 1}. ${field.name}`] = sectionFields.map((softwareField, idx) => ({
                        [`${idx + 1}. Software / Logiciel`]: softwareField['Software / Logiciel'],
                        [`Version`]: softwareField['Version'],
                        [`Purpose / Objectif`]: softwareField['Purpose / Objectif']
                    }));
                    const key = Object.keys(formData).find(key => key.endsWith(field.name));
                    if (key) {
                        jsonOutput[section][`${index + 1}. ${field.name}`].push({ 'Description': formData[key] });
                    }
                } else if (field.type === 'fileOverview') {
                    jsonOutput[section][`${index + 1}. ${field.name}`] = fileOverviews.map((overview, idx) => ({
                        [`${idx + 1}. Type`]: overview.type,
                        [`Description`]: overview.description
                    }));
                } else if (field.type === 'additionalRelatedData') {
                    jsonOutput[section][`${index + 1}. ${field.name}`] = {
                        "Description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lacinia nisl odio, eget hendrerit eros varius sit amet. Donec at convallis erat. Aenean nec diam nec metus commodo fermentum. Vivamus vel fringilla odio, non condimentum ligula.",
                        "User Input": formData[field.name] || ''
                    };
                } else {
                    const key = Object.keys(formData).find(key => key.endsWith(field.name));
                    if (key) {
                        jsonOutput[section][`${index + 1}. ${field.name}`] = formData[key];
                    }
                }
            });
        });
        const dataStr = JSON.stringify(jsonOutput, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'readme.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleLicenceChange = (value) => {
        setFormData({ ...formData, 'Licence': value, 'Licence Description': licenceDescriptions[value] });
    };

    const handleSourceSensitivityChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>Readme File Generator</h1>
            </header>
            <div className="App-body">
                <div className="App-left">
                    <label>Select a discipline:</label>
                    <select onChange={(e) => setSelectedDiscipline(e.target.value)} value={selectedDiscipline}>
                        <option value="">--Choose a discipline--</option>
                        {disciplineOptions.map((discipline, index) => (
                            <option key={index} value={discipline}>{discipline}</option>
                        ))}
                    </select>
                </div>
                <div className="App-sections">
                    {selectedDiscipline && Object.keys(disciplineData).map((section, index) => (
                        <div key={index} className="App-section">
                            <h2>{section}</h2>
                            {disciplineData[section].map((field, idx) => (
                                <div key={idx} className="App-field">
                                    <label>{field.name}:</label>
                                    {field.name === 'Date of data collection / Date de la collecte des données:' ? (
                                        <div className="date-picker-group">
                                            <div className="date-picker-column">
                                                <label>Start Date:</label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={handleStartDateChange}
                                                    dateFormat="MM/yyyy"
                                                    showMonthYearPicker
                                                    showFullMonthYearPicker
                                                />
                                            </div>
                                            <div className="date-picker-column">
                                                <label>End Date:</label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={handleEndDateChange}
                                                    dateFormat="MM/yyyy"
                                                    showMonthYearPicker
                                                    showFullMonthYearPicker
                                                />
                                            </div>
                                        </div>
                                    ) : field.type === 'small' ? (
                                        <input
                                            type="text"
                                            onChange={(e) => handleInputChange(0, field.name, e.target.value)}
                                        />
                                    ) : field.type === 'large' && field.subfields ? (
                                        <>
                                            <textarea
                                                onChange={(e) => handleInputChange(0, field.name, e.target.value)}
                                            />
                                            {(softwareFields[`${section} ${field.name}`] || []).map((softwareField, sIdx) => (
                                                <div key={sIdx} className="App-subfield-group">
                                                    {field.subfields.map(subfield => (
                                                        <div key={subfield} className="App-subfield">
                                                            <label>{subfield}:</label>
                                                            <input
                                                                type="text"
                                                                onChange={(e) => handleSoftwareInputChange(`${section} ${field.name}`, sIdx, subfield, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            <button className="App-button" onClick={() => addSoftwareField(`${section} ${field.name}`)}>Add Software</button>
                                            <button className="App-button" onClick={() => removeLastSoftwareField(`${section} ${field.name}`)}>Remove Last Software</button>
                                        </>
                                    ) : field.type === 'large' ? (
                                        <textarea
                                            onChange={(e) => handleInputChange(0, field.name, e.target.value)}
                                        />
                                    ) : field.type === 'contributor' ? (
                                        <>
                                            {contributors.map((contributor, cIdx) => (
                                                <div key={cIdx} className="App-contributor-group">
                                                    <div className="App-contributor-column">
                                                        <label>Role:</label>
                                                        <select
                                                            className="App-contributor-role"
                                                            onChange={(e) => handleContributorChange(cIdx, 'role', e.target.value)}
                                                        >
                                                            <option value="">--Select Role--</option>
                                                            {roles.map((role, rIdx) => (
                                                                <option key={rIdx} value={role}>{role}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="App-contributor-column">
                                                        <label>Name (Last name, Name):</label>
                                                        <input
                                                            className="App-contributor-name"
                                                            type="text"
                                                            onChange={(e) => handleContributorChange(cIdx, 'name', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="App-button" onClick={addContributor}>Add another</button>
                                            <button className="App-button" onClick={removeLastContributor}>Erase last</button>
                                        </>
                                    ) : field.type === 'fileOverview' ? (
                                        <>
                                            {fileOverviews.map((overview, fIdx) => (
                                                <div key={fIdx} className="App-fileOverview-group">
                                                    <div className="App-fileOverview-column">
                                                        <label>Item Type / Type d'élément:</label>
                                                        <select
                                                            className="App-fileOverview-type"
                                                            onChange={(e) => handleFileOverviewChange(fIdx, 'type', e.target.value)}
                                                            style={{ width: '150px' }} // Adjust width here
                                                        >
                                                            <option value="">--Select Type--</option>
                                                            <option value="File">File / Fichier</option>
                                                            <option value="Folder">Folder / Dossier</option>
                                                        </select>
                                                    </div>
                                                    <div className="App-fileOverview-column">
                                                        <label>Description:</label>
                                                        <p>Please provide a brief description of the item.</p> {/* Instructions added here */}
                                                        <textarea
                                                            className="App-fileOverview-description"
                                                            onChange={(e) => handleFileOverviewChange(fIdx, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="App-button" onClick={addFileOverview}>Add another</button>
                                            <button className="App-button" onClick={removeLastFileOverview}>Erase last</button>
                                        </>
                                    ) : field.type === 'additionalRelatedData' ? (
                                        <>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lacinia nisl odio, eget hendrerit eros varius sit amet. Donec at convallis erat. Aenean nec diam nec metus commodo fermentum. Vivamus vel fringilla odio, non condimentum ligula.</p>
                                            <input
                                                type="text"
                                                onChange={(e) => handleAdditionalRelatedDataChange(field.name, e.target.value)}
                                            />
                                        </>
                                    ) : field.type === 'licence' ? (
                                        <>
                                            <div className="App-licence-group">
                                                <div className="App-licence-column">
                                                    <label>Licence:</label>
                                                    <select
                                                        className="App-licence-select"
                                                        onChange={(e) => handleLicenceChange(e.target.value)}
                                                    >
                                                        <option value="">--Select Licence--</option>
                                                        {Object.keys(licenceDescriptions).map((licence, lIdx) => (
                                                            <option key={lIdx} value={licence}>{licence}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="App-licence-column">
                                                    <label>Description:</label>
                                                    <p>{formData['Licence Description'] || 'Please select a licence to see its description.'}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : field.type === 'sourceSensitivity' ? (
                                        <>
                                            <div className="App-sourceSensitivity-group">
                                                <div className="App-sourceSensitivity-column">
                                                    <label className="no-bold-label">Was data derived from another source? / Les données proviennent-elles d'une autre source ?:</label>
                                                    <select
                                                        className="App-sourceSensitivity-select"
                                                        onChange={(e) => handleSourceSensitivityChange('Source Derived', e.target.value)}
                                                    >
                                                        <option value="">--Select--</option>
                                                        {sourceSensitivityOptions.map((option, sIdx) => (
                                                            <option key={sIdx} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="App-sourceSensitivity-column">
                                                    <label className="no-bold-label">The data are sensitive or derived from autochthonous population / Les données sont sensibles ou proviennent de la population autochtones:</label>
                                                    <select
                                                        className="App-sourceSensitivity-select"
                                                        onChange={(e) => handleSourceSensitivityChange('Sensitive Data', e.target.value)}
                                                    >
                                                        <option value="">--Select--</option>
                                                        {sourceSensitivityOptions.map((option, sIdx) => (
                                                            <option key={sIdx} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    ) : field.type === 'recommendedCitation' ? (
                                        <textarea
                                            onChange={(e) => handleAdditionalRelatedDataChange(field.name, e.target.value)}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="App-buttons">
                <button className="App-button" onClick={exportAsTxt}>Export as .txt</button>
                <button className="App-button" onClick={exportAsJson}>Export as .json</button>
            </div>
        </div>
    );
}

export default App;
