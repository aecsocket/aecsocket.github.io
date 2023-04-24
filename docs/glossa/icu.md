---
sidebar_position: 2
---

# ICU Guide

## Preface

The official Unicode ICU documentation is very verbose, and takes a lot of effort to understand properly.
This document aims to provide a simpler guide to ICU than is available elsewhere.

You can find ICU documentation on formats [here](https://unicode-org.github.io/icu/userguide/format_parse/).

## Templates

A template is a block in your format that will be replaced by an argument specified from code.

```icu-message-format
New messages: {new_messages, number}
```

The `{new_messages, number}` block will be replaced by whatever value is passed in:

| `new_messages` | Result |
|----------------|--------|
| 5 | `New messages: 5` |
| 17 | `New messages: 17` |

## Types

When defining a template, you can optionally define what type of value it will be displayed
as:

| Type | Display as | Example |
|------|-------------|---------|
| (none) | a raw piece of text | `You got a friend request from {username}` |
| `number` | a number, with separators and other features based on the language | `Current followers: {followers, number}` |
| `plural` | a number, which changes how the rest of the message is shown (more info later) | `You have {followers, plural, ...}` |
| `date` | a point in time | `You first joined on {first_join, date}` |

For each type, you can define some extra parameters.

### Number

Numbers can be formatted according to the locale that the message is being translated in.
For this document, US English will be used, but each format will be localized appropriately
to the locale being generated for.

You can combine these together, e.g. `% .00`

#### Precision

Define how many decimal places the number will be formatted up to, handling rounding.

| Format | Description | Value | Result |
|--------|-------------|-------|--------|
| `{_, number, :: .00}` | Exactly 2 digits | 12.7777 | `12.78` |
| | | 12 | `12.00` |
| | | |
| `{_, number, :: .00*}` | At least 2 digits | 12.7777 | `12.7777` |
| | | 12 | `12.00` |
| | | |
| `{_, number, :: .##}` | Maximum 2 digits | 12.7777 | `12.78` |
| | | 12 | `12` |
| | | |
| `{_, number, :: .0#}` | Between 1 and 2 digits | 12.7777 | `12.78` |
| | | 12 | `12.0` |

#### Percent

Format the number as a percentage.

| Format | Description | Value | Result |
|--------|-------------|-------|--------|
| `{_, number, :: %}` | As a percentage (raw value) | 0.75 | `0.75%` |
| `{_, number, :: %x100}` | As a percentage (multiply by 100) | 0.75 | `75%` |

#### Magnitude

How different magnitudes of numbers are displayed.

| Format | Description | Value | Result |
|--------|-------------|-------|--------|
| `{_, number, :: K}` | Short; letters | 1234 | `1.2K` |
| | | 1789 | `1.8K` |
| | | 12345 | `12K` |
| | | 1200000 | `1.2M` |
| | | |
| `{_, number, :: KK}` | Long; names | 1234 | `1.2 thousand` |
| | | 1789 | `1.8 thousand` |
| | | 12345 | `12 thousand` |
| | | 1200000 | `1.2 million` |

#### Units and currencies

Format the number as a unit or currency.
Note that currency formatting does *not* do currency conversions.

You can find a list of all units and currencies at the end of this document.

| Format | Description | Value | Result |
|--------|-------------|-------|--------|
| `{_, number, :: unit/meter}` | As a unit | 1234 | `1,234 m` |
| `{_, number, :: unit/teaspoon}` | | | `1,234 tsp` |
| | | |
| `{_, number, :: currency/CAD}` | As a currency | 1234 | `CA$1,234.00` |
| `{_, number, :: currency/GRD}` | | | `GRD 1,234.00` |

### Date

You can define the form in which a date is displayed - it's recommended to use
some default format options.

| Format | Description | Result |
|--------|-------------|--------|
| `{_, date, short}` | Numeric | `12/13/52` |
| `{_, date, medium}` | Written short | `Jan. 12, 1952` |
| `{_, date, long}` | Written long | `January 12, 1952` |
| `{_, date, full}` | All details | `Tuesday, April 12, 1952 AD` |

## Plurals

If an argument is provided as a number, you can output a different message depending
on the number, and how the language handles plurals:

```icu-message-format
You have {cart_items, plural,
  one {# item}
  other {# items}
} in your shopping cart.
```

| `cart_items` | Result |
|--------------|--------|
| 0 | `You have 0 items in your shopping cart.` |
| 1 | `You have 1 item in your shopping cart.` |
| 2 | `You have 2 items in your shopping cart.` |

The different quantifiers you can specify are:
- `one`
- `two`
- `few`
- `many`
- `other` - required
- `=[a number]` - for a specific number, e.g. `=1`. Use the above types if possible.

## Selection

You can change the output depending on the text value of another argument:

```icu-message-format
{player} has been {player_state, select,
  dead {killed}
  alive {revived}
}!
```

Depending on the value passed to `player_state`, a different message is used here:

| `player_state` | Result |
|----------------|--------|
| dead | `ThePlayer has been killed!` |
| alive | `ThePlayer has been revived!` |

You can also access the actual value passed to the selected argument inside the block:

```icu-message-format
You entered {world_type, select,
  easy {an easy}
  hard {a hard}
  other {the {world_type}}
} world!
```

| `world_type` | Result |
|--------------|--------|
| easy | `You entered an easy world!` |
| hard | `You entered a hard world!` |
| impossible | `You entered the impossible world!` |

## Addendum

<details>
<summary>List of units</summary>

```
acre
acre-foot
ampere
arc-minute
arc-second
astronomical-unit
atmosphere
bar
barrel
bit
british-thermal-unit
bushel
byte
calorie
candela
carat
celsius
centiliter
centimeter
century
cubic-centimeter
cubic-foot
cubic-inch
cubic-kilometer
cubic-meter
cubic-mile
cubic-yard
cup
cup-metric
dalton
day
day-person
decade
deciliter
decimeter
degree
dessert-spoon
dessert-spoon-imperial
dot
dot-per-centimeter
dot-per-inch
dram
drop
dunam
earth-mass
earth-radius
electronvolt
em
fahrenheit
fathom
fluid-ounce
fluid-ounce-imperial
foodcalorie
foot
furlong
g-force
gallon
gallon-imperial
generic
gigabit
gigabyte
gigahertz
gigawatt
grain
gram
hectare
hectoliter
hectopascal
hertz
horsepower
hour
inch
inch-ofhg
jigger
joule
karat
kelvin
kilobit
kilobyte
kilocalorie
kilogram
kilohertz
kilojoule
kilometer
kilometer-per-hour
kilopascal
kilowatt
kilowatt-hour
knot
light-year
liter
liter-per-100-kilometer
liter-per-kilometer
lumen
lux
megabit
megabyte
megahertz
megaliter
megapascal
megapixel
megawatt
meter
meter-per-second
meter-per-square-second
metric-ton
microgram
micrometer
microsecond
mile
mile-per-gallon
mile-per-gallon-imperial
mile-per-hour
mile-scandinavian
milliampere
millibar
milligram
milligram-per-deciliter
milliliter
millimeter
millimeter-ofhg
millimole-per-liter
millisecond
milliwatt
minute
mole
month
month-person
nanometer
nanosecond
nautical-mile
newton
newton-meter
ohm
ounce
ounce-troy
parsec
pascal
percent
permille
permillion
permyriad
petabyte
picometer
pinch
pint
pint-metric
pixel
pixel-per-centimeter
pixel-per-inch
point
pound
pound-force
pound-force-foot
pound-force-per-square-inch
quart
quart-imperial
radian
revolution
second
solar-luminosity
solar-mass
solar-radius
square-centimeter
square-foot
square-inch
square-kilometer
square-meter
square-mile
square-yard
stone
tablespoon
teaspoon
terabit
terabyte
therm-us
ton
volt
watt
week
week-person
yard
year
year-person
```

Generated by

```kotlin
MeasureUnit.getAvailable()
  .filter { it.type != "currency" }
  .sortedBy { it.subtype }
  .forEach { println(it.subtype) }
```

</details>

<details>
<summary>List of currencies</summary>

```
ADP - Andorran Peseta
AED - United Arab Emirates Dirham
AFA - Afghan Afghani (1927–2002)
AFN - Afghan Afghani
ALK - Albanian Lek (1946–1965)
ALL - Albanian Lek
AMD - Armenian Dram
ANG - Netherlands Antillean Guilder
AOA - Angolan Kwanza
AOK - Angolan Kwanza (1977–1991)
AON - Angolan New Kwanza (1990–2000)
AOR - Angolan Readjusted Kwanza (1995–1999)
ARA - Argentine Austral
ARP - Argentine Peso (1983–1985)
ARS - Argentine Peso
ARY - ARY
ATS - Austrian Schilling
AUD - Australian Dollar
AWG - Aruban Florin
AYM - AYM
AZM - Azerbaijani Manat (1993–2006)
AZN - Azerbaijani Manat
BAD - Bosnia-Herzegovina Dinar (1992–1994)
BAM - Bosnia-Herzegovina Convertible Mark
BBD - Barbadian Dollar
BDT - Bangladeshi Taka
BEC - Belgian Franc (convertible)
BEF - Belgian Franc
BEL - Belgian Franc (financial)
BGJ - BGJ
BGK - BGK
BGL - Bulgarian Hard Lev
BGN - Bulgarian Lev
BHD - Bahraini Dinar
BIF - Burundian Franc
BMD - Bermudan Dollar
BND - Brunei Dollar
BOB - Bolivian Boliviano
BOP - Bolivian Peso
BOV - Bolivian Mvdol
BRB - Brazilian New Cruzeiro (1967–1986)
BRC - Brazilian Cruzado (1986–1989)
BRE - Brazilian Cruzeiro (1990–1993)
BRL - Brazilian Real
BRN - Brazilian New Cruzado (1989–1990)
BRR - Brazilian Cruzeiro (1993–1994)
BSD - Bahamian Dollar
BTN - Bhutanese Ngultrum
BUK - Burmese Kyat
BWP - Botswanan Pula
BYB - Belarusian Ruble (1994–1999)
BYN - Belarusian Ruble
BYR - Belarusian Ruble (2000–2016)
BZD - Belize Dollar
CAD - Canadian Dollar
CDF - Congolese Franc
CHC - CHC
CHE - WIR Euro
CHF - Swiss Franc
CHW - WIR Franc
CLF - Chilean Unit of Account (UF)
CLP - Chilean Peso
CNY - Chinese Yuan
COP - Colombian Peso
COU - Colombian Real Value Unit
CRC - Costa Rican Colón
CSD - Serbian Dinar (2002–2006)
CSJ - CSJ
CSK - Czechoslovak Hard Koruna
CUC - Cuban Convertible Peso
CUP - Cuban Peso
CVE - Cape Verdean Escudo
CYP - Cypriot Pound
CZK - Czech Koruna
DDM - East German Mark
DEM - German Mark
DJF - Djiboutian Franc
DKK - Danish Krone
DOP - Dominican Peso
DZD - Algerian Dinar
ECS - Ecuadorian Sucre
ECV - Ecuadorian Unit of Constant Value
EEK - Estonian Kroon
EGP - Egyptian Pound
ERN - Eritrean Nakfa
ESA - Spanish Peseta (A account)
ESB - Spanish Peseta (convertible account)
ESP - Spanish Peseta
ETB - Ethiopian Birr
EUR - Euro
FIM - Finnish Markka
FJD - Fijian Dollar
FKP - Falkland Islands Pound
FRF - French Franc
GBP - British Pound
GEK - Georgian Kupon Larit
GEL - Georgian Lari
GHC - Ghanaian Cedi (1979–2007)
GHP - GHP
GHS - Ghanaian Cedi
GIP - Gibraltar Pound
GMD - Gambian Dalasi
GNE - GNE
GNF - Guinean Franc
GNS - Guinean Syli
GQE - Equatorial Guinean Ekwele
GRD - Greek Drachma
GTQ - Guatemalan Quetzal
GWE - Portuguese Guinea Escudo
GWP - Guinea-Bissau Peso
GYD - Guyanaese Dollar
HKD - Hong Kong Dollar
HNL - Honduran Lempira
HRD - Croatian Dinar
HRK - Croatian Kuna
HTG - Haitian Gourde
HUF - Hungarian Forint
IDR - Indonesian Rupiah
IEP - Irish Pound
ILP - Israeli Pound
ILR - Israeli Shekel (1980–1985)
ILS - Israeli New Shekel
INR - Indian Rupee
IQD - Iraqi Dinar
IRR - Iranian Rial
ISJ - Icelandic Króna (1918–1981)
ISK - Icelandic Króna
ITL - Italian Lira
JMD - Jamaican Dollar
JOD - Jordanian Dinar
JPY - Japanese Yen
KES - Kenyan Shilling
KGS - Kyrgystani Som
KHR - Cambodian Riel
KMF - Comorian Franc
KPW - North Korean Won
KRW - South Korean Won
KWD - Kuwaiti Dinar
KYD - Cayman Islands Dollar
KZT - Kazakhstani Tenge
LAJ - LAJ
LAK - Laotian Kip
LBP - Lebanese Pound
LKR - Sri Lankan Rupee
LRD - Liberian Dollar
LSL - Lesotho Loti
LSM - LSM
LTL - Lithuanian Litas
LTT - Lithuanian Talonas
LUC - Luxembourgian Convertible Franc
LUF - Luxembourgian Franc
LUL - Luxembourg Financial Franc
LVL - Latvian Lats
LVR - Latvian Ruble
LYD - Libyan Dinar
MAD - Moroccan Dirham
MDL - Moldovan Leu
MGA - Malagasy Ariary
MGF - Malagasy Franc
MKD - Macedonian Denar
MLF - Malian Franc
MMK - Myanmar Kyat
MNT - Mongolian Tugrik
MOP - Macanese Pataca
MRO - Mauritanian Ouguiya (1973–2017)
MRU - Mauritanian Ouguiya
MTL - Maltese Lira
MTP - Maltese Pound
MUR - Mauritian Rupee
MVQ - MVQ
MVR - Maldivian Rufiyaa
MWK - Malawian Kwacha
MXN - Mexican Peso
MXP - Mexican Silver Peso (1861–1992)
MXV - Mexican Investment Unit
MYR - Malaysian Ringgit
MZE - Mozambican Escudo
MZM - Mozambican Metical (1980–2006)
MZN - Mozambican Metical
NAD - Namibian Dollar
NGN - Nigerian Naira
NIC - Nicaraguan Córdoba (1988–1991)
NIO - Nicaraguan Córdoba
NLG - Dutch Guilder
NOK - Norwegian Krone
NPR - Nepalese Rupee
NZD - New Zealand Dollar
OMR - Omani Rial
PAB - Panamanian Balboa
PEH - PEH
PEI - Peruvian Inti
PEN - Peruvian Sol
PES - Peruvian Sol (1863–1965)
PGK - Papua New Guinean Kina
PHP - Philippine Piso
PKR - Pakistani Rupee
PLN - Polish Zloty
PLZ - Polish Zloty (1950–1995)
PTE - Portuguese Escudo
PYG - Paraguayan Guarani
QAR - Qatari Rial
RHD - Rhodesian Dollar
ROK - ROK
ROL - Romanian Leu (1952–2006)
RON - Romanian Leu
RSD - Serbian Dinar
RUB - Russian Ruble
RUR - Russian Ruble (1991–1998)
RWF - Rwandan Franc
SAR - Saudi Riyal
SBD - Solomon Islands Dollar
SCR - Seychellois Rupee
SDD - Sudanese Dinar (1992–2007)
SDG - Sudanese Pound
SDP - Sudanese Pound (1957–1998)
SEK - Swedish Krona
SGD - Singapore Dollar
SHP - St. Helena Pound
SIT - Slovenian Tolar
SKK - Slovak Koruna
SLL - Sierra Leonean Leone
SOS - Somali Shilling
SRD - Surinamese Dollar
SRG - Surinamese Guilder
SSP - South Sudanese Pound
STD - São Tomé & Príncipe Dobra (1977–2017)
STN - São Tomé & Príncipe Dobra
SUR - Soviet Rouble
SVC - Salvadoran Colón
SYP - Syrian Pound
SZL - Swazi Lilangeni
THB - Thai Baht
TJR - Tajikistani Ruble
TJS - Tajikistani Somoni
TMM - Turkmenistani Manat (1993–2009)
TMT - Turkmenistani Manat
TND - Tunisian Dinar
TOP - Tongan Paʻanga
TPE - Timorese Escudo
TRL - Turkish Lira (1922–2005)
TRY - Turkish Lira
TTD - Trinidad & Tobago Dollar
TWD - New Taiwan Dollar
TZS - Tanzanian Shilling
UAH - Ukrainian Hryvnia
UAK - Ukrainian Karbovanets
UGS - Ugandan Shilling (1966–1987)
UGW - UGW
UGX - Ugandan Shilling
USD - US Dollar
USN - US Dollar (Next day)
USS - US Dollar (Same day)
UYI - Uruguayan Peso (Indexed Units)
UYN - UYN
UYP - Uruguayan Peso (1975–1993)
UYU - Uruguayan Peso
UYW - Uruguayan Nominal Wage Index Unit
UZS - Uzbekistani Som
VEB - Venezuelan Bolívar (1871–2008)
VEF - Venezuelan Bolívar (2008–2018)
VES - Venezuelan Bolívar
VNC - VNC
VND - Vietnamese Dong
VUV - Vanuatu Vatu
WST - Samoan Tala
XAF - Central African CFA Franc
XAG - Silver
XAU - Gold
XBA - European Composite Unit
XBB - European Monetary Unit
XBC - European Unit of Account (XBC)
XBD - European Unit of Account (XBD)
XCD - East Caribbean Dollar
XDR - Special Drawing Rights
XEU - European Currency Unit
XOF - West African CFA Franc
XPD - Palladium
XPF - CFP Franc
XPT - Platinum
XSU - Sucre
XTS - Testing Currency Code
XUA - ADB Unit of Account
XXX - Unknown Currency
YDD - Yemeni Dinar
YER - Yemeni Rial
YUD - Yugoslavian Hard Dinar (1966–1990)
YUM - Yugoslavian New Dinar (1994–2002)
YUN - Yugoslavian Convertible Dinar (1990–1992)
ZAL - South African Rand (financial)
ZAR - South African Rand
ZMK - Zambian Kwacha (1968–2012)
ZMW - Zambian Kwacha
ZRN - Zairean New Zaire (1993–1998)
ZRZ - Zairean Zaire (1971–1993)
ZWC - ZWC
ZWD - Zimbabwean Dollar (1980–2008)
ZWL - Zimbabwean Dollar (2009)
ZWN - ZWN
ZWR - Zimbabwean Dollar (2008)
```

Generated by

```kotlin
MeasureUnit.getAvailable()
  .filter { it.type == "currency" }
  .map { it as com.ibm.icu.util.Currency }
  .sortedBy { it.subtype }
  .forEach { println("${it.subtype} - ${it.displayName}") }
```

</details>
