import { useState } from "react";
import React from "react";
import "./form.css";

const Form = () => {
	// Tady jsem definovala data - ve formatu pole objektu
	// Objekt obsahuje tyto promenne:
	// name - drzi hodnotu input field name
	// type - drzi hodnotu input field type
	// label - drzi hodnotu input field label
	// value - drzi hodnotu input field value
	// errorMessage - drzi hodnotu error message, ktera sa zobrazi, kdyz selze validace
	// showError - boolean hodnota, ktera sa pouziva na zobrazeni errorMessage
	const [formData, setFormData] = useState([
		{
			name: "ico",
			type: "text",
			label: "IČO",
			value: "",
			errorMessage: "Prosím, vyplňte správné IČO (8 čísel)",
			showError: false,
		},
		{
			name: "nameCompany",
			type: "text",
			label: "Název firmy",
			value: "",
			errorMessage: "Prosím, vyplňte název firmy",
			showError: false,
		},
		{
			name: "dic",
			type: "text",
			label: "DIČ",
			value: "",
			errorMessage: "Prosím, vyplňte správné DIČ (CZ00000000)",
			showError: false,
		},
		{
			name: "town",
			type: "text",
			label: "Název města",
			value: "",
			errorMessage: "Prosím, vyplňte název města",
			showError: false,
		},
		{
			name: "street",
			type: "text",
			label: "Ulice",
			value: "",
			errorMessage: "Prosím, vyplňte jméno ulice",
			showError: false,
		},
		{
			name: "numberStreet",
			type: "text",
			label: "Číslo ulice",
			value: "",
			errorMessage: "Prosím, vyplňte číslo ulice.",
			showError: false,
		},
		{
			name: "numberHouse",
			type: "text",
			label: "Číslo popisné",
			value: "",
			errorMessage: "Prosím, vyplňte číslo popisné",
			showError: false,
		},
		{
			name: "postCode",
			type: "text",
			label: "PSČ",
			value: "",
			errorMessage: "Prosím, vyplňte správný formát PSČ",
			showError: false,
		},
	]);

	let isLoading = false;

	// Tato funkce se vola v inputu a prijima parameter event
	// Funkce nam vola validateInput a nastavuje nam value pres setFormData
	const handleChange = (event) => {
		const id = event.target.id;
		const name = event.target.name;
		const value = event.target.value;

		validateInput(id, name, value);

		setFormData((formData) => {
			const newFormData = [...formData];
			newFormData[id] = { ...newFormData[id], value: value };
			return newFormData;
		});
	};

	// Tato funkce se vola ve validateInput
	// Prijima dva parametry - id a showError
	// Nastavuje na showError pres setFormData
	const updateShowError = (id, showError) => {
		setFormData((formData) => {
			const newFormData = [...formData];
			newFormData[id] = { ...newFormData[id], showError: showError };
			return newFormData;
		});
	};

	// fetchCompanyData funkce vola Rest API Ares pres GET
	// Posila ICO hodnotu v requestu, vyplnenou uzivatelem
	// V responsu nam vraci object dat, ktera obsahuji informace o firme
	// Tyto udaje pak funkce zapisuje do formData do promenne value
	const fetchCompanyData = async (value) => {
		isLoading = true;
		fetch(
			"https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/" +
				value
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching");
				}
				isLoading = false;
				return response.json();
			})
			.then((data) => {
				const newFormData = [...formData];
				let dataValue = "";

				formData.forEach(function (item, index) {
					if (item.name === "ico") {
						dataValue = data.ico;
					}
					if (item.name === "nameCompany") {
						dataValue = data.obchodniJmeno;
					}
					if (item.name === "postCode") {
						dataValue = data.sidlo.psc;
					}
					if (item.name === "town") {
						dataValue = data.sidlo.nazevObce;
					}
					if (item.name === "numberHouse") {
						dataValue = data.sidlo.cisloDomovni;
					}
					if (item.name === "dic") {
						dataValue = data.dic;
					}
					if (item.name === "street") {
						dataValue = data.sidlo.nazevUlice;
					}
					if (item.name === "numberStreet") {
						dataValue = data.sidlo.cisloOrientacni;
					}
					newFormData[index] = { ...newFormData[index], value: dataValue };
					dataValue = "";
				});

				setFormData(() => {
					return [...newFormData];
				});
				isLoading = false;
			});
	};

	// Funkce validateInput se vola ve funkci handleChange
	// Prijima tri parametry - id (index pozice objectu v poli), name a value.
	// Funkce validuje hodnoty napsane uzivatelem do inputu
	const validateInput = (id, name, value) => {
		if (name === "ico") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat jenom cisla od 0-9
			// Hodnota inputu musi mit delku 8
			if (/^[0-9]{8}$/.test(value)) {
				fetchCompanyData(value);
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "nameCompany") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat mala a velka pismena od A-Z, pomlcky, mezery a tecky
			if (/^[a-zA-Z- .]+$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "dic") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu musí obsahovat na zacatku velka písmena CZ
			// Hodnota inputu muze obsahovat cisla od 0-9
			// Hodnota inputu musi mit delku 10 (CZ + 8 cisel)
			if (/^CZ[0-9]{8}$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "town") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat mala a velka pismena od A-Z, pomlcky a mezery
			if (/^[a-zA-Z- ]+$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "street") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat mala a velka pismena od A-Z a mezery
			if (/^[a-zA-Z ]+$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "numberStreet") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat cisla od 0-9
			if (/^[0-9]+$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "numberHouse") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat cisla od 0-9
			if (/^[0-9]+$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
		if (name === "postCode") {
			// Tato validace upozorni uzivatele, kdyz input nesplni tyto podminky
			// Hodnota inputu muze obsahovat cisla od 0-9
			// Hodnota inputu musi mit delku 5
			if (/^[0-9]{5}$/.test(value)) {
				updateShowError(id, false);
			} else {
				updateShowError(id, true);
			}
		}
	};
	// V tagu form je pouzita metoda map na zobrazeni dat pomoci promenne formData
	// Prijima dva parametry item a index
	return (
		<div className="container mt-3 mb-3">
			<form>
				{isLoading ? (
					<div className="overlay" id="loading">
						<div className="spinner_center">
							<div className="d-flex justify-content-center">
								<div className="spinner-border" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
							</div>
						</div>
					</div>
				) : null}
				{formData.map((item, index) => (
					<div key={index}>
						<label htmlFor={item.name} className="form-label">
							{item.label}
						</label>
						<input
							id={index}
							name={item.name}
							type={item.type}
							value={item.value}
							onChange={handleChange}
							className={`form-control ${item.showError ? "is-invalid" : ""}`}
						/>
						{item.showError ? (
							<div className="invalid-feedback">{item.errorMessage}</div>
						) : null}
					</div>
				))}
			</form>
		</div>
	);
};

export default Form;
