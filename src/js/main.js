const countryContainer = document.getElementById("countryContainer")
const searchCountryInput = document.getElementById("searchInput")
const searchfilter = document.querySelector(".search-filter")
const backBtn = document.getElementById("backBtn")
const listAndDetails = document.querySelector(".countrylist__details")
const regionDropdown = document.querySelector("#regionSelectDropdown")
const filterBox = document.querySelector(".filter-box")

//******************* Fetch and save */
let allCountries = []
fetch(`https://restcountries.com/v3.1/all`)
    .then(res => res.json())
    .then((data) => {
        console.log("ALLDATA: ", data)
        allCountries = data.map((country) => {
            return {
                name: country.name.common,
                population: country.population,
                region: country.region,
                capital: country.capital,
                flag: country.flags.svg,
                subregion: country.subregion,
                languages: country.languages,
                currencies: country.currencies,
                topLevelDomain: country.tld,
                borders: country.borders
            }
        })
        console.log("CUSTOM DATA:  ", allCountries)
    })
    .then(() => {
        for (let index = 0; index < allCountries.length; index++) {
            const country = allCountries[index];
            countryContainer.innerHTML += `
            <div country class="country">
                <div class="country-header flag-wrapper"><img class="country-flag" src="${country.flag}" alt="CountryFlag"></div>
                <div class="country-body country-content">
                    <div class="country-title">${country.name}</div>
                    <ul class="country-specs">
                        <li class="country-population">Population: <span>${country.population.toLocaleString('en-US')}</span></li>
                        <li class="country-region">Region: <span class="regionInfo">${country.region}</span></li>
                        <li class="country-capital">Capital: <span>${country.capital}</span></li>
                    </ul>
                </div>
            </div>
        `
        }
        return countryList = document.querySelectorAll("[country]")
    })

//******************* Region Fİlter */
function regionBox() {
    regionDropdown.classList.toggle("hidden")
}
window.onclick = function (event) {
    if (event.target.matches('button ')) { return }
    regionDropdown.classList.add("hidden")
}
regionDropdown.addEventListener("click", (clickedRegion) => {
    const selectedRegion = clickedRegion.target.innerText
    const regionInfo = document.querySelectorAll(".regionInfo")
    // console.log(countryRegion)
    for (let i = 0; i < regionInfo.length; i++) {
        if (!(selectedRegion == regionInfo[i].innerText)) {
            countryList[i].classList.add("hidden")
        } else {
            countryList[i].classList.remove("hidden")
        }
    }
})

//******************* Search Input */
searchCountryInput.addEventListener("keyup", (pressedKey) => {
    let value = pressedKey.target.value.toUpperCase()
    for (let i = 0; i < countryList.length; i++) {
        if (!countryList[i].children[1].children[0].innerText.toUpperCase().includes(value) && !value == 0) {
            countryList[i].classList.add("hidden")
        } else {
            countryList[i].classList.remove("hidden")
        }
    }
})

//******************* select Country Details and borders*/

listAndDetails.addEventListener("click", (clickedObject) => {
    if (!clickedObject.target.matches(".country-flag")) return;
    let clickedFlag = clickedObject.target.src;
    detailRender(clickedFlag)
})
// 
function detailRender(controler) {
    for (let i = 0; i < allCountries.length; i++) {
        if (allCountries[i].flag == controler) {
            listAndDetails.innerHTML = ""
            displayCountryDetails(allCountries[i])
        }
    }
}

function displayCountryDetails(country) {
    const html = `
            <button id="backBtn"onClick="backToMain()"><i class="fa-solid fa-arrow-left-long hidden"></i> Back</button>
            <div id="countryDetail">
                <div class="country-details-card">
                    <div class="flag">
                        <img src="${country.flag}" alt="Germany Flag">
                    </div>
                    <div class="country-detail-desc">
                        <h2 class="detail-heading">${country.name}</h2>
                        <div class="detail-body detail-body-left">
                            <div class="detail-body-item" id="natName">Native Name: <span>${country.name}</span></div>
                            <div class="detail-body-item" id="population">Population: <span>${country.population.toLocaleString('en-US')}</span></div>
                            <div class="detail-body-item" id="region">Region: <span>${country.region}</span></div>
                            <div class="detail-body-item" id="subRegion">Sub Region: <span>${country.subregion}</span></div>
                            <div class="detail-body-item" id="capital">Capital: <span>${country.capital}</span></div>
                        </div>
                        <div class="detail-body detail-body-right">
                            <div class="detail-body-item" id="topLevelDomain">Top Level Domain: <span>${country.topLevelDomain[0]}</span></div>
                            <div class="detail-body-item" id="currencies">Currencies: <span>${Object.values(country.currencies)[0].name}</span></div>
                            <div class="detail-body-item" id="languages">Languages: <span>${Object.values(country.languages)}</span></div>
                        </div>
                        <div class="detail-body detail-body-bottom">
                            <div class="detail-body-item" id="bordersBox">Border Countries: </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    listAndDetails.insertAdjacentHTML("beforeend", html)

    // add Borders
    if (!country.borders) {
        document.querySelector("#bordersBox").insertAdjacentHTML("beforeEnd", "No Neighboring Country")
    } else {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders}`).then(res => res.json())
            .then((borders) => {
                //  ['FRA', 'DEU', 'LUX', 'NLD'] "example"
                let filtered = []
                borders.map((border, index) => {
                    document.querySelector("#bordersBox").insertAdjacentHTML("afterEnd", `
                        <span class="detail-border">${border.name.common}</span>
                    `)
                    filtered.push({ name: border.name.common, flag: border.flags.svg })
                })
                return filtered;

            })
            // border click control
            .then((filtered) => {
                const borders = document.querySelectorAll(".detail-border")
                borders.forEach(border => border.addEventListener('click', (clickedBorder) => {
                    for (const border of filtered) {
                        if (clickedBorder.target.innerText == border.name) {
                            detailRender(border.flag)
                        }
                    }
                }));
            })
    }
}

//******************* Back Btn */
function backToMain() {
    location.reload()
}

//******************* theme-box */
const themeBox = document.querySelector(".theme-box")
const links = document.querySelectorAll("link")
themeBox.addEventListener("click", (e) => {
    for (const link of links) {
        console.log(link.href)
        if (link.href == "#") {
            link.setAttribute("href", "./src/css/lightTheme.css")
        } else if (link.href == "./src/css/lightTheme.css") {
            link.setAttribute("href", "#")
        }
    }
})
