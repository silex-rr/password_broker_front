export class PasswordGenerator {
    static SYMBOLS_LETTERS_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    static SYMBOLS_LETTERS_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    static SYMBOLS_DIGITS = '0123456789';
    static SYMBOLS_COMMON = '-_';
    static SYMBOLS_BRACKETS = '()[]{}<>';
    static SYMBOLS_SPECIAL = '!@#$%^*&';

    _length = 24;
    _try_to_put_all_selected_symbols_in_password = true;
    _symbols_letter_lowercase = true;
    _symbols_letter_uppercase = true;
    _symbols_letter_digits = true;
    _symbols_letter_common = true;
    _symbols_letter_brackets = false;
    _symbols_letter_special = false;

    generate() {
        const passwordCandidate = this.__generateString(this.__getStringForRandomizer(), this._length);

        return this.__finishPassword(passwordCandidate);
    }

    generateList(num) {
        let out = [];
        while (num-- > 0) {
            out.push(this.generate());
        }
        return out;
    }

    get length() {
        return this._length;
    }

    set length(value) {
        this._length = value;
    }

    get try_to_put_all_selected_symbols_in_password() {
        return this._try_to_put_all_selected_symbols_in_password;
    }

    set try_to_put_all_selected_symbols_in_password(value) {
        this._try_to_put_all_selected_symbols_in_password = value;
    }

    get symbols_letter_lowercase() {
        return this._symbols_letter_lowercase;
    }

    set symbols_letter_lowercase(value) {
        this._symbols_letter_lowercase = value;
    }

    get symbols_letter_uppercase() {
        return this._symbols_letter_uppercase;
    }

    set symbols_letter_uppercase(value) {
        this._symbols_letter_uppercase = value;
    }

    get symbols_letter_digits() {
        return this._symbols_letter_digits;
    }

    set symbols_letter_digits(value) {
        this._symbols_letter_digits = value;
    }

    get symbols_letter_common() {
        return this._symbols_letter_common;
    }

    set symbols_letter_common(value) {
        this._symbols_letter_common = value;
    }

    get symbols_letter_brackets() {
        return this._symbols_letter_brackets;
    }

    set symbols_letter_brackets(value) {
        this._symbols_letter_brackets = value;
    }

    get symbols_letter_special() {
        return this._symbols_letter_special;
    }

    set symbols_letter_special(value) {
        this._symbols_letter_special = value;
    }

    __generateString(symbolSet, length) {
        let result = '';
        for (let i = 0; i < length; ++i) {
            result += symbolSet[Math.floor(Math.random() * symbolSet.length)];
        }
        return result;
    }

    __getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    __getStringForRandomizer() {
        let string = '';
        if (this._symbols_letter_lowercase) {
            string += PasswordGenerator.SYMBOLS_LETTERS_LOWERCASE;
        }
        if (this._symbols_letter_uppercase) {
            string += PasswordGenerator.SYMBOLS_LETTERS_UPPERCASE;
        }
        if (this._symbols_letter_digits) {
            string += PasswordGenerator.SYMBOLS_DIGITS;
        }
        if (this._symbols_letter_common) {
            string += PasswordGenerator.SYMBOLS_COMMON;
        }
        if (this._symbols_letter_brackets) {
            string += PasswordGenerator.SYMBOLS_BRACKETS;
        }
        if (this._symbols_letter_special) {
            string += PasswordGenerator.SYMBOLS_SPECIAL;
        }
        return string;
    }

    __finishPassword(passwordCandidate) {
        if (!this._try_to_put_all_selected_symbols_in_password) {
            return passwordCandidate;
        }
        const passwordCandidateArr = passwordCandidate.split('');

        const symbolsPositions = this.__getSymbolsPositions(passwordCandidateArr);

        return this.__improveSymbolsPositions(passwordCandidateArr, symbolsPositions).join('');
    }

    __improveSymbolsPositions(passwordCandidateArr, symbolsPositions) {
        const symbolRangesCount = {};
        Object.keys(symbolsPositions).forEach(k => {
            symbolRangesCount[k] = symbolsPositions[k].length;
        });

        const symbolsDonors = Object.keys(symbolRangesCount).filter(key => symbolRangesCount[key] > 1);
        const symbolsToFill = Object.keys(symbolRangesCount).filter(key => symbolRangesCount[key] === 0);

        if (symbolsDonors.length === 0 || symbolsToFill.length === 0) {
            return passwordCandidateArr;
        }
        const symbolsDonorsCount = [];
        for (let i = 0; i < symbolsDonors.length; i++) {
            symbolsDonorsCount[i] = symbolRangesCount[symbolsDonors[i]];
        }

        for (let i = 0; i < symbolsToFill.length; i++) {
            const symbolToFill = symbolsToFill[i];
            let max = Math.max(...symbolsDonorsCount);

            if (max <= 1) {
                break;
            }

            const newSymbol = this.__generateString(symbolToFill, 1);

            const indexOfDonor = symbolsDonorsCount.indexOf(max);
            symbolsDonorsCount[indexOfDonor]--;
            const symbolsDonor = symbolsDonors[indexOfDonor];
            const position = this.__getRandomElement(symbolsPositions[symbolsDonor]);
            symbolsPositions[symbolsDonor].splice(position, 1);
            passwordCandidateArr[position] = newSymbol;
            symbolsPositions[symbolToFill].push(position);
        }
        return passwordCandidateArr;
    }

    __getSymbolsPositions(passwordCandidateArr) {
        const positions = {};
        if (this._symbols_letter_uppercase) {
            positions[PasswordGenerator.SYMBOLS_LETTERS_LOWERCASE] = [];
        }
        if (this._symbols_letter_uppercase) {
            positions[PasswordGenerator.SYMBOLS_LETTERS_UPPERCASE] = [];
        }
        if (this._symbols_letter_digits) {
            positions[PasswordGenerator.SYMBOLS_DIGITS] = [];
        }
        if (this._symbols_letter_common) {
            positions[PasswordGenerator.SYMBOLS_COMMON] = [];
        }
        if (this._symbols_letter_brackets) {
            positions[PasswordGenerator.SYMBOLS_BRACKETS] = [];
        }
        if (this._symbols_letter_special) {
            positions[PasswordGenerator.SYMBOLS_SPECIAL] = [];
        }

        passwordCandidateArr.forEach((char, pos) => {
            Object.keys(positions).forEach(symbols => {
                if (symbols.includes(char)) {
                    positions[symbols].push(pos);
                }
            });
        });

        return positions;
    }
}
