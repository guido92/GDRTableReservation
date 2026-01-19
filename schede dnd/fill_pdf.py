
import pypdf
import os
import traceback

template_path = "CharacterSheet_3Pgs_ Complete.pdf"

characters = [
    {
        "filename": "Valerius_Paladin.pdf",
        "data": {
            "CharacterName": "Valerius 'Scudo dell'Alba'",
            "ClassLevel": "Paladino (Gloria) 3",
            "Race": "Umano (Var)",
            "Background": "Soldato",
            "Alignment": "Legale Buono",
            "PlayerName": "Giocatore",
            "XP": "900",
            
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
            
            "Wpn Name": "Spada Lunga", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d8+5 T",
            
            "AttacksSpellcasting": "Punizione Divina: 2d8 slot 1\nIncanalare Divinità (1/rip):\n- Atleta Senza Pari: Vant Atletica/Acrob.\n- C. Ispiratore: reaz +2d8+3 PF temp a 9m",
            
            "Features and Traits": "Talento: Sentinella\nSenso Divino (4/gg)\nImposizione Mani (15 PF)\nStile: Duello (+2 danni)\nSalute Divina (Immune malattie)",
            
            "ProficienciesLang": "Tutte armature, scudi, armi semplici/marziali.\nComune, Nanico.",
            
            "Equipment": "Spada Lunga, Scudo, Cotta Maglia, Simbolo Sacro, Kit Esploratore",
            
            "CP": "0", "SP": "0", "GP": "10",
            
            # Spells (Approximate mapping to first few lines)
            "Spells 1014": "PREPARATI:",
            "Spells 1015": "Benedizione, Cura Ferite",
            "Spells 1016": "Scudo della Fede, Comando",
            "Spells 1017": "GIURAMENTO:",
            "Spells 1018": "Dardo Tracciante, Eroismo"
        }
    },
    {
        "filename": "Durin_Cleric.pdf",
        "data": {
            "CharacterName": "Durin Stoneheart",
            "ClassLevel": "Chierico (Crepuscolo) 3",
            "Race": "Nano delle Colline",
            "Background": "Accolito",
            "Alignment": "Legale Neutrale",
            
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
            
            "Wpn Name": "Martello da Guerra", "Wpn1 AtkBonus": "+4", "Wpn1 Damage": "1d8+2 C",
            
            "AttacksSpellcasting": "Inc. Divinità (1/rip):\nSantuario Crepuscolo (9m, 1d6+3 PF temp)\n\nVigilante (Vant Iniziativa)",
            
            "Features and Traits": "Scurovisione 90m (condividibile)\nResilienza Nanica\nRobustezza Nanica",
            
            "ProficienciesLang": "Armature pesanti/medie/leggi, scudi.\nComune, Nanico.",
            "Equipment": "Martello, Scudo, Cotta Maglia, Simbolo, Kit Sacerdote",
            
            "Spells 1014": "Trucchetti: Fiamma Sacra, Guida",
            "Spells 1015": "Parola Guaritrice, Dardo Tracc.",
            "Spells 1016": "Santuario, Arma Spirituale",
            "Spells 1017": "DOMINIO: Sonno, Raggio Luna",
            "Spells 1018": "Fuoco Fatato, Vedere Invisib."
        }
    },
    {
        "filename": "Elara_Ranger.pdf",
        "data": {
            "CharacterName": "Elara 'Sussurro'",
            "ClassLevel": "Ranger (Gloom Stalker) 3",
            "Race": "Elfo dei Boschi",
            "Background": "Forestiero",
            
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
            
            "Wpn Name": "Arco Lungo", "Wpn1 AtkBonus": "+7", "Wpn1 Damage": "1d8+3 P",
            "Wpn Name 2": "Spada Corta", "Wpn2 AtkBonus": "+5", "Wpn2 Damage": "1d6+3 P",
            
            "AttacksSpellcasting": "Stile: Tiro (+2 tpc)\nAgguato Atroce: 1° turno +3m vel, +1 attacco (+1d8 danni)",
            
            "Features and Traits": "Nemico: Non morti\nEsploratore Nato\nVista Ombra (Invisibile a scurovisione)",
            
            "ProficienciesLang": "Leggere/Medie, Scudi, Semplici/Marz.\nComune, Elfico, Silvano.",
            "Equipment": "Arco Lungo, 2 Spade Corte, Cuoio Borchiato",
            
            "Spells 1014": "Marchio del Cacciatore",
            "Spells 1015": "Assorbire Elementi",
            "Spells 1016": "Parlare con Animali",
            "Spells 1017": "Gloom: Camuffare Se Stesso"
        }
    },
    {
        "filename": "Kaelthas_Sorcerer.pdf",
        "data": {
            "CharacterName": "Kaelthas",
            "ClassLevel": "Stregone (Mente Aberr) 3",
            "Race": "Mezzelfo",
            "Background": "Eremita",
            
            "STR": "8",  "STRmod": "-1",
            "DEX": "14", "DEXmod": "+2",
            "CON": "16", "CONmod": "+3",
            "INT": "10", "INTmod": "+0",
            "WIS": "12", "WISmod": "+1",
            "CHA": "17", "CHamod": "+3", # Should be +3 (16/17 same mod)
            
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
            
            "Wpn Name": "Dardo di Fuoco", "Wpn1 AtkBonus": "+5", "Wpn1 Damage": "1d10 F",
            
            "AttacksSpellcasting": "Metamagia: Rapido, Sottile\nPunti Stregoneria: 3\nTelepatia 9m",
            
            "Features and Traits": "Incantesimi Psionici\nMezzelfo: Scurovisione, +2 Skill",
            
            "Equipment": "Focus cristallo, Balestra leggera, Pugnale",
            
            "Spells 1014": "TRUCCHETTI: Dardo, Mano Magica,",
            "Spells 1015": "Messaggio, Illusione Minore",
            "Spells 1016": "Fiotto Mentale",
            "Spells 1017": "PSIONICI: Braccia di Hadar",
            "Spells 1018": "Sussurri Dissonanti, Calmare Emoz.",
            "Spells 1019": "Individuazione Pensieri",
            "Spells 1020": "CONOSCIUTI: Armatura Magica",
            "Spells 1021": "Scudo, Immagine Speculare",
            "Spells 1022": "Suggestione"
        }
    }
]

for char in characters:
    try:
        reader = pypdf.PdfReader(template_path)
        writer = pypdf.PdfWriter()
        
        # Use simple append which often preserves forms better
        writer.append_pages_from_reader(reader)
            
        # Fill fields on the first page
        if len(writer.pages) > 0:
            writer.update_page_form_field_values(
                writer.pages[0], char["data"]
            )
            # Maybe fields are on other pages too? This PDF has 3 pages.
            # But the main stats are on page 0.
            # update_page_form_field_values only updates fields ON THAT PAGE.
            # We should try to update name/etc on other pages if they exist.
        
        # Write
        with open(char["filename"], "wb") as output_stream:
            writer.write(output_stream)
            
        print(f"Generated {char['filename']}")
        
    except Exception as e:
        print(f"Failed to generate {char['filename']}")
        traceback.print_exc()
