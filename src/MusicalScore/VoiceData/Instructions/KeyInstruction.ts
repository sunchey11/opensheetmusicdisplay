import {AbstractNotationInstruction} from "./AbstractNotationInstruction";
import {SourceStaffEntry} from "../SourceStaffEntry";
import {NoteEnum} from "../../../Common/DataObjects/Pitch";
import {AccidentalEnum} from "../../../Common/DataObjects/Pitch";
import {Pitch} from "../../../Common/DataObjects/Pitch";

/**
 * A [[KeyInstruction]] is a key signature denoting which notes are to be sharpened or flattened.
 */
export class KeyInstruction extends AbstractNotationInstruction {
    constructor(sourceStaffEntry: SourceStaffEntry = undefined, key: number = 0, mode: KeyEnum = KeyEnum.major) {
        super(sourceStaffEntry);
        this.Key = key;
        this.mode = mode;
    }

    private static sharpPositionList: NoteEnum[] = [NoteEnum.F, NoteEnum.C, NoteEnum.G, NoteEnum.D, NoteEnum.A, NoteEnum.E, NoteEnum.B];
    private static flatPositionList: NoteEnum[] = [NoteEnum.B, NoteEnum.E, NoteEnum.A, NoteEnum.D, NoteEnum.G, NoteEnum.C, NoteEnum.F];

    private keyType: number;
    private mode: KeyEnum;

    public static copy(keyInstruction: KeyInstruction): KeyInstruction {
        let newKeyInstruction: KeyInstruction = new KeyInstruction(keyInstruction.parent, keyInstruction.Key, keyInstruction.Mode);
        return newKeyInstruction;
    }

    public static getNoteEnumList(instruction: KeyInstruction): NoteEnum[] {
        let enums: NoteEnum[] = [];
        if (instruction.keyType > 0) {
            for (let i: number = 0; i < instruction.keyType; i++) {
                enums.push(KeyInstruction.sharpPositionList[i]);
            }
        }
        if (instruction.keyType < 0) {
            for (let i: number = 0; i < Math.abs(instruction.keyType); i++) {
                enums.push(KeyInstruction.flatPositionList[i]);
            }
        }
        return enums;
    }

    public static getAllPossibleMajorKeyInstructions(): KeyInstruction[] {
        let keyInstructionList: KeyInstruction[] = [];
        for (let keyType: number = -7; keyType < 7; keyType++) {
            let currentKeyInstruction: KeyInstruction = new KeyInstruction(undefined, keyType, KeyEnum.major);
            keyInstructionList.push(currentKeyInstruction);
        }
        return keyInstructionList;
    }

    public get Key(): number {
        return this.keyType;
    }

    public set Key(value: number) {
        this.keyType = value;
    }

    public get Mode(): KeyEnum {
        return this.mode;
    }

    public set Mode(value: KeyEnum) {
        this.mode = value;
    }

    public getFundamentalNotesOfAccidentals(): NoteEnum[] {
        let noteList: NoteEnum[] = [];
        if (this.keyType > 0) {
            for (let i: number = 0; i < this.keyType; i++) {
                noteList.push(KeyInstruction.sharpPositionList[i]);
            }
        } else if (this.keyType < 0) {
            for (let i: number = 0; i < -this.keyType; i++) {
                noteList.push(KeyInstruction.flatPositionList[i]);
            }
        }
        return noteList;
    }

    public getAlterationForPitch(pitch: Pitch): AccidentalEnum {
        if (this.keyType > 0 && KeyInstruction.sharpPositionList.indexOf(pitch.FundamentalNote) <= this.keyType) {
            return AccidentalEnum.SHARP;
        } else if (this.keyType < 0 && KeyInstruction.flatPositionList.indexOf(pitch.FundamentalNote) <= Math.abs(this.keyType)) {
            return AccidentalEnum.FLAT;
        }
        return AccidentalEnum.NONE;
    }

    public ToString(): string {
        return "Key: " + this.keyType + "" + this.mode;
    }

    public OperatorEquals(key2: KeyInstruction): boolean {
        let key1: KeyInstruction = this;
        if (key1 === key2) {
            return true;
        }
        if ((key1 === undefined) || (key2 === undefined)) {
            return false;
        }
        return (key1.Key === key2.Key && key1.Mode === key2.Mode);
    }

    public OperatorNotEqual(key2: KeyInstruction): boolean {
        return !(this.OperatorEquals(key2));
    }
}

export class NoteEnumToHalfToneLink {
    constructor(note: NoteEnum, halftone: number) {
        this.note = note;
        this.halfTone = halftone;
    }

    public note: NoteEnum;
    public halfTone: number;
}

export enum KeyEnum {
    major = 0,
    minor = 1,
    none = 2,
    dorian = 3,
    phrygian = 4,
    lydian = 5,
    mixolydian = 6,
    aeolian = 7,
    ionian = 8,
    locrian = 9,
}
