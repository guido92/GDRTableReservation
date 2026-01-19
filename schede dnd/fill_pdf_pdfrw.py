
import pdfrw
import os

template_path = "CharacterSheet_3Pgs_ Complete.pdf"

# Helper to map list of strings to fields starting at start_index
def map_lines(field_prefix, start_index, lines, count):
    data = {}
    for i in range(count):
        if i < len(lines):
            key = f"{field_prefix}{start_index + i}"
            data[key] = lines[i]
    return data

characters = [
    {
        "filename": "Valerius_Paladin.pdf",
        "data": {
            "CharacterName": "Valerius 'Scudo dell'Alba'",
            "CharacterName 2": "Valerius",
            "ClassLevel": "Paladino (Gloria) 3",
            "Race ": "Umano (Variante)",
            "Background": "Soldato",
            "Alignment": "Legale Buono",
            "PlayerName": "Giocatore",
            "XP": "900",
            
            "Age": "28", "Height": "1.85m", "Weight": "90kg",
            "Eyes": "Azzurri", "Skin": "Abbronzata", "Hair": "Biondi",
            "Backstory": "Valerius è un veterano di una crociata contro le forze dell'oscurità. Sopravvissuto a una battaglia in cui la sua unità fu massacrata, ha giurato di essere lo scudo di chi non può difendersi. La sua armatura è lucidata maniacalmente, simbolo della luce che porta. Ha sentito voci su un antico male, l'Occhio Oscuro, e si è diretto verso la tana di Vecna per estirparlo.",
            
            "STR": "16", "STRmod": "+3",
            "DEX": "10", "DEXmod": "+0",
            "CON": "14", "CONmod": "+2",
            "INT": "8",  "INTmod": "-1",
            "WIS": "10", "WISmod": "+0",
            "CHA": "16", "CHamod": "+3",
            
            "ProfBonus": "+2",
            "AC": "18",
            "Initiative": "+0",
            "Speed": "9m",
            "HPMax": "28",
            "HPCurrent": "28",
            "HDTotal": "3d10",
            "Passive": "10",
            
            "ST Wisdom": "+2", "ST Charisma": "+5", "ST Strength": "+3",
            "Athletics": "+5", "Intimidation": "+5", "Persuasion": "+5", "Insight": "+2",
            "PersonalityTraits ": "Sono sempre educato e rispettoso.\nProteggo chi non può difendersi da solo.",
            "Ideals": "Responsabilità. Faccio ciò che devo e obbedisco alla giusta autorità.",
            "Bonds": "Coloro che combattono al mio fianco sono la cosa per cui vale la pena morire.",
            "Flaws": "Ho poca pazienza per le sciocchezze e gli indovinelli.",
            "Wpn Name": "Spada Lunga", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d8+5 T",
            "AttacksSpellcasting": "Punizione Divina: 2d8 slot 1\nIncanalare Divinità (1/rip):\n- Atleta Senza Pari: Vant Atletica/Acrob.\n- C. Ispiratore: reaz +2d8+3 PF temp a 9m",
            "Features and Traits": "Talento: Sentinella\nSenso Divino (4/gg)\nImposizione Mani (15 PF)\nStile: Duello (+2 danni)\nSalute Divina (Immune malattie)",
            "ProficienciesLang": "Tutte armature, scudi, armi semplici/marziali.\nComune, Nanico.",
            "Equipment": "Spada Lunga, Scudo, Cotta Maglia, Simbolo Sacro, Kit Esploratore, Insegna di Grado.",
            "CP": "0", "SP": "0", "GP": "10",
            
            "Spellcasting Class 2": "Paladino",
            "SpellcastingAbility 2": "CAR",
            "SpellSaveDC  2": "13",
            "SpellAtkBonus 2": "+5",
            "SlotsTotal 19": "3", 
            
            **map_lines("Spells 10", 14, ["--- TRUCCHETTI ---", "- (Nessuno) -"], 9),
            **map_lines("Spells 10", 23, ["Dardo Tracciante (Giuramento)", "Eroismo (Giuramento)", "Benedizione", "Cura Ferite", "Scudo della Fede", "Comando"], 11)
        }
    },
    {
        "filename": "Durin_Cleric.pdf",
        "data": {
            "CharacterName": "Durin Stoneheart",
            "CharacterName 2": "Durin",
            "ClassLevel": "Chierico (Crepuscolo) 3",
            "Race ": "Nano delle Colline",
            "Background": "Accolito",
            "Alignment": "Legale Neutrale",
            
            "Age": "65", "Height": "1.35m", "Weight": "78kg",
            "Eyes": "Marroni", "Skin": "Chiara", "Hair": "Rossi",
            "Backstory": "Durin ha passato la giovinezza a custodire le cripte ancestrali del suo clan. Una visione della dea del crepuscolo gli ha mostrato un'oscurità crescente (Vecna) che minaccia non solo i vivi ma anche il riposo dei morti. Ha lasciato la montagna per portare la luce tenue del crepuscolo dove la notte è più profonda.",
            
            "STR": "14", "STRmod": "+2",
            "DEX": "10", "DEXmod": "+0",
            "CON": "16", "CONmod": "+3",
            "INT": "10", "INTmod": "+0",
            "WIS": "16", "WISmod": "+3",
            "CHA": "8",  "CHamod": "-1",
            
            "ProfBonus": "+2",
            "AC": "18",
            "Initiative": "Vant.",
            "Speed": "7.5m",
            "HPMax": "30",
            "HPCurrent": "30",
            "HDTotal": "3d8",
            "Passive": "13",
            
            "ST Wisdom": "+5", "ST Charisma": "+1", "ST Constitution": "+3",
            "Insight": "+5", "Medicine": "+5", "Religion": "+2", "History": "+2",
            "PersonalityTraits ": "Vedo presagi in ogni evento.\nSono tollerante con le altre fedi.",
            "Ideals": "Tradizione. Le antiche usanze devono essere preservate.",
            "Bonds": "Morirei per recuperare un'antica reliquia della mia fede.",
            "Flaws": "Giudico gli altri duramente e sono testardo.",
            "Wpn Name": "Martello da Guerra", "Wpn1 AtkBonus": "+4", "Wpn1 Damage": "1d8+2 C",
            "AttacksSpellcasting": "Inc. Divinità (1/rip):\nSantuario Crepuscolo (9m, 1d6+3 PF temp)\n\nVigilante (Vant Iniziativa)",
            "Features and Traits": "Scurovisione 90m (condividibile)\nResilienza Nanica (Res Veleno)\nRobustezza Nanica",
            "ProficienciesLang": "Armature pesanti/medie/leggi, scudi.\nComune, Nanico.",
            "Equipment": "Martello, Scudo, Cotta Maglia, Simbolo, Kit Sacerdote, Vesti.",
            
            "Spellcasting Class 2": "Chierico",
            "SpellcastingAbility 2": "SAG",
            "SpellSaveDC  2": "13",
            "SpellAtkBonus 2": "+5",
            "SlotsTotal 19": "4", "SlotsTotal 20": "2",
            
            **map_lines("Spells 10", 14, ["Fiamma Sacra", "Guida", "Rintocco dei Morti"], 9),
            **map_lines("Spells 10", 23, ["Fuoco Fatato (Dominio)", "Sonno (Dominio)", "Parola Guaritrice", "Dardo Tracciante", "Santuario", "Benedizione", "Cura Ferite", "Comando"], 11),
            **map_lines("Spells 10", 34, ["Raggio di Luna (Dominio)", "Vedere Invisibilità (Dominio)", "Arma Spirituale", "Ristorare Inferiore", "Aiuto"], 13)
        }
    },
    {
        "filename": "Elara_Ranger.pdf",
        "data": {
            "CharacterName": "Elara 'Sussurro'",
            "CharacterName 2": "Elara",
            "ClassLevel": "Ranger (Gloom Stalker) 3",
            "Race ": "Elfo dei Boschi",
            "Background": "Forestiero",
            "Alignment": "Caotico Buono",
            
            "Age": "120", "Height": "1.70m", "Weight": "60kg",
            "Eyes": "Verdi", "Skin": "Ramata", "Hair": "Castani",
            "Backstory": "Elara ha perso la sua famiglia durante un'incursione di non morti evocati da cultisti. Ha imparato a fondersi con le ombre per cacciarli. È silenziosa e letale, preferendo l'azione alle parole. Si è unita al gruppo perché le tracce dell'Occhio Oscuro portano agli stessi cultisti che cerca da decenni.",
            
            "STR": "10", "STRmod": "+0",
            "DEX": "17", "DEXmod": "+3",
            "CON": "14", "CONmod": "+2",
            "INT": "12", "INTmod": "+1",
            "WIS": "14", "WISmod": "+2",
            "CHA": "8",  "CHamod": "-1",
            
            "ProfBonus": "+2",
            "AC": "15",
            "Initiative": "+5",
            "Speed": "10.5m",
            "HPMax": "28",
            "HPCurrent": "28",
            "HDTotal": "3d10",
            "Passive": "14",
            
            "ST Dexterity": "+5", "ST Strength": "+2",
            "Stealth": "+5", "Survival": "+4", "Perception": "+4", "Nature": "+3", "Athletics": "+2",
            "PersonalityTraits ": "Mi sento molto più a mio agio tra gli animali.",
            "Ideals": "Cambiamento. La vita è come le stagioni.",
            "Bonds": "Una terribile mostruosità ha ucciso la mia gente.",
            "Flaws": "Non capisco le etichette sociali e il denaro.",
            "Wpn Name": "Arco Lungo", "Wpn1 AtkBonus": "+7", "Wpn1 Damage": "1d8+3 P",
            "Wpn Name 2": "Spada Corta", "Wpn2 AtkBonus": "+5", "Wpn2 Damage": "1d6+3 P",
            "AttacksSpellcasting": "Stile: Tiro (+2 tpc)\nAgguato Atroce: 1° turno +3m vel, +1 attacco (+1d8 danni)",
            "Features and Traits": "Nemico: Non morti (Vantaggio)\nEsploratore Nato (XGtE)\nVista Ombra (Invisibile a scurovis.)\nScurovisione 18m(+9m)",
            "ProficienciesLang": "Leggere/Medie, Scudi, Semplici/Marz.\nComune, Elfico, Silvano.",
            "Equipment": "Arco Lungo, 2 Spade Corte, Cuoio Borchiato, Kit Esploratore, Trappola da caccia.",
            
            "Spellcasting Class 2": "Ranger",
            "SpellcastingAbility 2": "SAG", "SpellSaveDC  2": "12", "SpellAtkBonus 2": "+4", "SlotsTotal 19": "3",
            
            **map_lines("Spells 10", 14, ["--- TRUCCHETTI ---", "- (Nessuno) -"], 9),
            **map_lines("Spells 10", 23, ["Camuffare Se Stesso (Gloom)", "Marchio del Cacciatore", "Assorbire Elementi", "Parlare con Animali"], 11)
        }
    },
    {
        "filename": "Kaelthas_Sorcerer.pdf",
        "data": {
            "CharacterName": "Kaelthas",
            "CharacterName 2": "Kaelthas",
            "ClassLevel": "Stregone (Mente Aberr) 3",
            "Race ": "Mezzelfo",
            "Background": "Eremita",
            "Alignment": "Caotico Neutrale",
            
            "Age": "24", "Height": "1.78m", "Weight": "70kg",
            "Eyes": "Viola", "Skin": "Pallida", "Hair": "Bianchi",
            "Backstory": "Kaelthas ha toccato un artefatto proibito da bambino, collegando la sua mente a un'entità del Far Realm. Da allora sente sussurri e vede pattern che altri ignorano. I suoi poteri sono inquietanti, tentacoli d'ombra e telepatia invasiva. Cerca Vecna perché i sussurri nella sua testa glielo ordinano... o forse per farli tacere per sempre.",
            
            "STR": "8",  "STRmod": "-1",
            "DEX": "14", "DEXmod": "+2",
            "CON": "16", "CONmod": "+3",
            "INT": "10", "INTmod": "+0",
            "WIS": "12", "WISmod": "+1",
            "CHA": "17", "CHamod": "+3",
            
            "ProfBonus": "+2",
            "AC": "12 (15 Mag)",
            "Initiative": "+2",
            "Speed": "9m",
            "HPMax": "23",
            "HPCurrent": "23",
            "HDTotal": "3d6",
            "Passive": "11",
            
            "ST Constitution": "+5", "ST Charisma": "+5",
            "Deception": "+5", "Persuasion": "+5", "Insight": "+3", "Arcana": "+2",
            "PersonalityTraits ": "Parlo per enigmi e sento voci.",
            "Ideals": "Logica. Le emozioni non devono offuscare il pensiero.",
            "Bonds": "Cerco l'illuminazione sulla mia natura aberrente.",
            "Flaws": "A volte fisso il vuoto e parlo con esseri invisibili.",
            "Wpn Name": "Dardo di Fuoco", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d10 F",
            "AttacksSpellcasting": "Metamagia: Rapido (2pt), Sottile (1pt)\nPunti Stregoneria: 3\nTelepatia 9m (Free)",
            "Features and Traits": "Origine: Mente Aberrante\nIncantesimi Psionici\nMezzelfo: Scurovisione, +2 Skill",
            "ProficienciesLang": "Daghe, Dardi, Fionde, Bastoni, Balestre L.\nComune, Elfico, Deep Speech.",
            "Equipment": "Focus cristallo, Balestra leggera, Pugnale, Kit Diplomatico.",
            "Spellcasting Class 2": "Stregone", "SpellcastingAbility 2": "CAR", "SpellSaveDC  2": "13", "SpellAtkBonus 2": "+5", "SlotsTotal 19": "4", "SlotsTotal 20": "2",
            
            **map_lines("Spells 10", 14, ["Dardo di Fuoco", "Mano Magica", "Messaggio", "Illusione Minore", "Fiotto Mentale"], 9),
            **map_lines("Spells 10", 23, ["Braccia di Hadar (Psionico)", "Sussurri Dissonanti (Psionico)", "Armatura Magica", "Scudo"], 11),
            **map_lines("Spells 10", 34, ["Calmare Emozioni (Psionico)", "Individuazione Pensieri (Psionico)", "Immagine Speculare", "Suggestione"], 13)
        }
    },
    # NEW CHARACTERS
    {
        "filename": "Malakai_Warlock.pdf",
        "data": {
            "CharacterName": "Malakai 'Il Segnato'",
            "CharacterName 2": "Malakai",
            "ClassLevel": "Warlock (Hexblade) 3",
            "Race ": "Tiefling",
            "Background": "Criminale",
            "Alignment": "Caotico Neutrale",
            
            "Age": "22", "Height": "1.80m", "Weight": "75kg",
            "Eyes": "Gialli", "Skin": "Rossa", "Hair": "Neri",
            "Backstory": "Malakai ha trovato una spada d'ombra in un tempio dimenticato. L'arma gli sussurra, guidando la sua lama. Ex contrabbandiere, ora cerca potere per spezzare il patto, o forse per diventarne il padrone.",
            
            "STR": "8",  "STRmod": "-1",
            "DEX": "14", "DEXmod": "+2",
            "CON": "14", "CONmod": "+2",
            "INT": "10", "INTmod": "+0",
            "WIS": "12", "WISmod": "+1",
            "CHA": "17", "CHamod": "+3",
            
            "ProfBonus": "+2",
            "AC": "16 (Corazza a scaglie 14+2)",
            "Initiative": "+2",
            "Speed": "9m",
            "HPMax": "24",
            "HPCurrent": "24",
            "HDTotal": "3d8",
            "Passive": "11",
            
            "ST Wisdom": "+3", "ST Charisma": "+5",
            "Deception": "+5", "Intimidation": "+5", "Stealth": "+4", "Arcana": "+2",
            
            "PersonalityTraits ": "Gioco sempre con una moneta quando penso.",
            "Ideals": "Libertà. Le catene sono fatte per essere spezzate.",
            "Bonds": "Devo ripagare un vecchio debito con la gilda dei ladri.",
            "Flaws": "Quando vedo qualcosa di valore, non riesco a resistere.",
            
            "Wpn Name": "Spada Lunga (Patto)", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d8+4 (1d10+4)", # Hexblade usa Cha (+3) e Pact Weapon (+1)
            "Wpn Name 2": "Deflagrazione Occulta", "Wpn2 AtkBonus": "+5", "Wpn2 Damage": "1d10 F",
            
            "AttacksSpellcasting": "Maledizione Hex (1/rip): +2 danni, Crit 19-20, Cura su kill.\nPatto Lama (Evoca arma).\nSuppliche: Armatura d'Ombre (Mage Armor a volontà), Arma Migliorata (+1)",
            "Features and Traits": "Hexblade: Usa CAR per armi.\nResistenza Infernale (Fuoco)\nScurovisione 18m",
            "ProficienciesLang": "Leggere/Medie, Scudi, Semplici/Marziali.\nComune, Infernale.",
            "Equipment": "Spada Lunga (+1 magica), Corazza a scaglie, Scudo (se serve), Piede di porco, Abiti scuri.",
            
            "Spellcasting Class 2": "Warlock", "SpellcastingAbility 2": "CAR", "SpellSaveDC  2": "13", "SpellAtkBonus 2": "+5", "SlotsTotal 20": "2", # Pact Magic
            
            **map_lines("Spells 10", 14, ["Deflagrazione Occulta", "Mano Magica", "Taumaturgia (Tiefling)"], 9),
            **map_lines("Spells 10", 34, ["Passo Velato (Misty Step)", "Sortilegio (Hex)", "Scudo (Hexblade)", "Immagine Speculare"], 13)
        }
    },
    {
        "filename": "Kenta_Monk.pdf",
        "data": {
            "CharacterName": "Kenta 'Loto Silente'",
            "CharacterName 2": "Kenta",
            "ClassLevel": "Monaco (Misericordia) 3",
            "Race ": "Elfo dei Boschi",
            "Background": "Eremita",
            "Alignment": "Legale Neutrale",
            
            "Age": "100", "Height": "1.75m", "Weight": "65kg",
            "Eyes": "Nocciola", "Skin": "Ambrata", "Hair": "Castani (Rasati)",
            "Backstory": "Kenta porta la maschera della misericordia, dispensando guarigione agli innocenti e fine rapida ai corrotti. Il suo monastero è stato profanato da cultisti di Vecna, e ora viaggia per purificare il mondo da questa piaga non morta.",
            
            "STR": "10", "STRmod": "+0",
            "DEX": "17", "DEXmod": "+3",
            "CON": "14", "CONmod": "+2",
            "INT": "10", "INTmod": "+0",
            "WIS": "15", "WISmod": "+2",
            "CHA": "8",  "CHamod": "-1",
            
            "ProfBonus": "+2",
            "AC": "15 (10+3Des+2Sag)",
            "Initiative": "+3",
            "Speed": "13.5m", # 10.5 base + 3 monaco
            "HPMax": "24",
            "HPCurrent": "24",
            "HDTotal": "3d8",
            "Passive": "14",
            
            "ST Strength": "+2", "ST Dexterity": "+5",
            "Acrobatics": "+5", "Stealth": "+5", "Perception": "+4", "Insight": "+4", "Medicine": "+4",
            
            "PersonalityTraits ": "Parlo poco, i miei gesti dicono tutto.",
            "Ideals": "Equilibrio. La vita e la morte sono parte dello stesso ciclo.",
            "Bonds": "La mia maschera è il volto del mio ordine.",
            "Flaws": "Sono freddo e distaccato di fronte alla sofferenza.",
            
            "Wpn Name": "Colpo Senz'Armi", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d4+3 C",
            "Wpn Name 2": "Lancia (Monaca)", "Wpn2 AtkBonus": "+5", "Wpn2 Damage": "1d6/8+3 P",
            
            "AttacksSpellcasting": "Arti Marziali (1d4, Colpo bonus)\nKi (3 pt): Raffica, Schivata, Disimpegno.\nMani Guarritrici (Ki): Cura 1d4+2\nMani Nocive (Ki): Danni necrotici extra 1d4+2",
            "Features and Traits": "Difesa Senza Armatura\nMovimento Senza Armatura (+3m)\nDeviare Missili\nMaschera della Misericordia (Competenza Intuizione/Medicina)",
            "ProficienciesLang": "Armi Semplici, Spade Corte.\nComune, Elfico, Silvano.",
            "Equipment": "Lancia, 10 Dardi, Maschera, Abiti comuni, Kit erborista.",
            
            "Spellcasting Class 2": "Ki", "SpellcastingAbility 2": "SAG", "SpellSaveDC  2": "12", "SpellAtkBonus 2": "+4",
        }
    },
    {
        "filename": "Grom_Barbarian.pdf",
        "data": {
            "CharacterName": "Grom 'Spezzateste'",
            "CharacterName 2": "Grom",
            "ClassLevel": "Barbaro (Zelota) 3",
            "Race ": "Mezzorco",
            "Background": "Forestiero",
            "Alignment": "Caotico Buono",
            
            "Age": "20", "Height": "2.00m", "Weight": "120kg",
            "Eyes": "Neri", "Skin": "Grigia", "Hair": "Neri",
            "Backstory": "Grom crede di essere stato scelto dagli dei della tempesta per distruggere i non morti. Corre in battaglia urlando preghiere confuse e spaccando crani. La sua furia è santa, o almeno così dice lui.",
            
            "STR": "17", "STRmod": "+3",
            "DEX": "14", "DEXmod": "+2",
            "CON": "16", "CONmod": "+3",
            "INT": "8",  "INTmod": "-1",
            "WIS": "10", "WISmod": "+0",
            "CHA": "10", "CHamod": "+0",
            
            "ProfBonus": "+2",
            "AC": "15 (10+2Des+3Cos)",
            "Initiative": "+2",
            "Speed": "9m",
            "HPMax": "35", # 12+3 + 7+3 + 7+3
            "HPCurrent": "35",
            "HDTotal": "3d12",
            "Passive": "10",
            
            "ST Strength": "+5", "ST Constitution": "+5",
            "Athletics": "+5", "Survival": "+2", "Intimidation": "+2", "Nature": "+1",
            
            "PersonalityTraits ": "Urlo il nome del mio dio quando colpisco.",
            "Ideals": "Destino. Nessuno può sfuggire alla morte, tranne me.",
            "Bonds": "Proteggerò i miei compagni finché avrò respiro.",
            "Flaws": "La mia ira mi rende cieco al pericolo.",
            
            "Wpn Name": "Ascia Bipenne", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d12+3 (+2 Ira)",
            "Wpn Name 2": "Giavellotto", "Wpn2 AtkBonus": "+5", "Wpn2 Damage": "1d6+3 P",
            
            "AttacksSpellcasting": "Ira (3/giorno): +2 Danni, Res. Tagl/Perf/Cont.\nFuria Divina (Zelota): Il primo colpo in ira fa 1d6+1 Radiosi extra.\nAttacco Irruento (Vantaggio tpc / Subisci Vantaggio)",
            "Features and Traits": "Difesa Senza Armatura (Con)\nPercezione del Pericolo (Vant TS Des)\nCritico Selvaggio (Mezzorco)\nTenacia Implacabile (Resti a 1 PF)",
            "ProficienciesLang": "Leggere/Medie, Scudi, Semplici/Marziali.\nComune, Orchesco.",
            "Equipment": "Ascia Bipenne, 4 Giavellotti, Trofeo di caccia.",
            
            "Spellcasting Class 2": "Barbaro",
        }
    }
]

for char in characters:
    try:
        pdf = pdfrw.PdfReader(template_path)
        for page in pdf.pages:
            annotations = page['/Annots']
            if annotations:
                for annotation in annotations:
                    try:
                        if annotation['/Subtype'] == '/Widget' and annotation['/T']:
                            key_raw = annotation['/T'].to_unicode()
                            key_clean = key_raw.strip('()')
                            
                            if key_clean in char['data']:
                                val = char['data'][key_clean]
                                annotation.update(pdfrw.PdfDict(V='{}'.format(val)))
                                if '/AP' in annotation:
                                    del annotation['/AP']
                    except Exception as loop_e:
                        pass 

        pdfrw.PdfWriter().write(char['filename'], pdf)
        print(f"Generated {char['filename']}")
        
    except Exception as e:
        print(f"Failed to generate {char['filename']}: {e}")
