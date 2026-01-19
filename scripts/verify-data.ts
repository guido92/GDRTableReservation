
import { CLASSES, Option, Feature } from '../src/data/dnd-data';

async function verify() {
    console.log("Verifying Class Data Integrity (Levels 1-20)...");
    let missing = 0;

    CLASSES.forEach((cls: Option) => {
        console.log(`Checking ${cls.name}...`);
        // Check for features at key levels
        const levels = [1, 2, 3, 5, 10, 20];
        levels.forEach((lvl: number) => {
            const hasFeature = cls.features?.some((f: Feature) => f.level === lvl);
            if (!hasFeature) {
                console.warn(`  ⚠️  Missing features for Level ${lvl} in ${cls.name}`);
                missing++;
            }
        });

        // Check suboptions
        if (cls.suboptions) {
            cls.suboptions.forEach((sub: Option) => {
                if (!sub.features || sub.features.length === 0) {
                    console.warn(`  ⚠️  Subclass ${sub.name} has no features!`);
                    missing++;
                }
            });
        }
    });

    if (missing === 0) {
        console.log("✅ All Classes have features for Levels 1, 2, 3, 5, 10, 20.");
    } else {
        console.error(`❌ Found ${missing} gaps in data.`);
    }
}

verify();
