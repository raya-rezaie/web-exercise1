class Calculator {
    constructor() {}

    calculateFormula(formula, variables) {
        switch (formula) {
            case 'price':
                return variables.count * variables.fee - variables.discount;
            case 'cylinderVolume':
                return Math.PI * Math.pow(variables.radius, 2) * variables.height;
            case 'rectangleArea':
                return variables.width * variables.length;
            default:
                return 0;
        }
    }
}

class InputField {
    constructor(id, validateCallback, defaultValue = null) {
        this.element = document.getElementById(id);
        this.errorElement = document.getElementById(id + 'Error');
        this.defaultValue = defaultValue;
        this.touched = false;
        this.element.addEventListener('input', () => {
            if (!this.touched) this.touched = true;
            validateCallback();
        });
    }

    getValue() {
        const value = this.element.value.trim();
        if (value === "") return this.defaultValue;
        if (!/^-?\d+(\.\d+)?$/.test(value)) return null;
        return parseFloat(value);
    }

    isEmpty() {
        return this.element.value.trim() === '';
    }

    setError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = message ? 'inline' : 'none';
    }

    isValid() {
        return this.errorElement.style.display === 'none';
    }
}

class Application {
    constructor() {
        this.calculator = new Calculator();
        this.allPriceInputsTouched = false;

        // Initialize inputs with null defaults for geometric fields
        this.feeInput = new InputField('fee', () => this.validateFee(), 0);
        this.countInput = new InputField('count', () => this.validateCount(), 0);
        this.discountInput = new InputField('discount', () => this.validateDiscount(), 0);
        this.radiusInput = new InputField('radius', () => this.validateRadius());
        this.heightInput = new InputField('height', () => this.validateHeight());
        this.widthInput = new InputField('width', () => this.validateWidth());
        this.lengthInput = new InputField('length', () => this.validateLength());

        // Initial validation to set correct states
        this.validateAllFields();

        // Set initial values
        this.updatePrice();
        this.updateVolume();
        this.updateArea();
    }

    validateAllFields() {
        this.validateFee();
        this.validateCount();
        this.validateDiscount();
        this.validateRadius();
        this.validateHeight();
        this.validateWidth();
        this.validateLength();
    }

    checkAllPriceInputsTouched() {
        this.allPriceInputsTouched = this.feeInput.touched && 
                                   this.countInput.touched && 
                                   this.discountInput.touched;
    }

    updatePrice() {
        this.checkAllPriceInputsTouched();
        
        if (!this.allPriceInputsTouched) {
            document.getElementById('formula1').textContent = 'Price: 0.00';
            return;
        }

        const allValid = this.feeInput.isValid() && 
                       this.countInput.isValid() && 
                       this.discountInput.isValid();

        if (allValid) {
            const fee = this.feeInput.getValue();
            const count = this.countInput.getValue();
            const discount = this.discountInput.getValue();
            const price = this.calculator.calculateFormula('price', { fee, count, discount });
            document.getElementById('formula1').textContent = `Price: ${price.toFixed(2)}`;
        } else {
            document.getElementById('formula1').textContent = 'Invalid Formula';
        }
    }

    updateVolume() {
        const allValid = this.radiusInput.isValid() && this.heightInput.isValid();
        const anyTouched = this.radiusInput.touched || this.heightInput.touched;

        if (allValid) {
            const radius = this.radiusInput.getValue() ?? 0;
            const height = this.heightInput.getValue() ?? 0;
            const volume = this.calculator.calculateFormula('cylinderVolume', { radius, height });
            document.getElementById('cylinderVolume').textContent = `Cylinder volume: ${volume.toFixed(2)}`;
        } else {
            document.getElementById('cylinderVolume').textContent = anyTouched 
                ? 'Invalid Formula' 
                : 'Cylinder volume: 0.00';
        }
    }

    updateArea() {
        const allValid = this.widthInput.isValid() && this.lengthInput.isValid();
        const anyTouched = this.widthInput.touched || this.lengthInput.touched;

        if (allValid) {
            const width = this.widthInput.getValue() ?? 0;
            const length = this.lengthInput.getValue() ?? 0;
            const area = this.calculator.calculateFormula('rectangleArea', { width, length });
            document.getElementById('rectangleArea').textContent = `Rectangle area: ${area.toFixed(2)}`;
        } else {
            document.getElementById('rectangleArea').textContent = anyTouched 
                ? 'Invalid Formula' 
                : 'Rectangle area: 0.00';
        }
    }

    // Validation methods
    validateFee() {
        if (this.feeInput.isEmpty()) {
            this.feeInput.setError('');
        } else {
            const value = this.feeInput.getValue();
            if (value === null) {
                this.feeInput.setError('Invalid number');
            } else if (value <= 0) {
                this.feeInput.setError('Must be positive');
            } else {
                this.feeInput.setError('');
            }
        }
        this.updatePrice();
    }

    validateCount() {
        if (this.countInput.isEmpty()) {
            this.countInput.setError('');
        } else {
            const value = this.countInput.getValue();
            if (value === null) {
                this.countInput.setError('Invalid number');
            } else if (value <= 0) {
                this.countInput.setError('Must be positive');
            } else {
                this.countInput.setError('');
            }
        }
        this.updatePrice();
    }

    validateDiscount() {
        const value = this.discountInput.getValue();
        const total = this.feeInput.getValue() * this.countInput.getValue();

        if (value === null) {
            this.discountInput.setError('Invalid number');
        } else if (value < 0) {
            this.discountInput.setError('Cannot be negative');
        } else if (value > total) {
            this.discountInput.setError('Exceeds total price');
        } else {
            this.discountInput.setError('');
        }
        this.updatePrice();
    }

    validateRadius() {
        if (this.radiusInput.isEmpty()) {
            this.radiusInput.setError('');
        } else {
            const value = this.radiusInput.getValue();
            if (value === null) {
                this.radiusInput.setError('Invalid number');
            } else if (value <= 0) {
                this.radiusInput.setError('Must be positive');
            } else {
                this.radiusInput.setError('');
            }
        }
        this.updateVolume();
    }

    validateHeight() {
        if (this.heightInput.isEmpty()) {
            this.heightInput.setError('');
        } else {
            const value = this.heightInput.getValue();
            if (value === null) {
                this.heightInput.setError('Invalid number');
            } else if (value <= 0) {
                this.heightInput.setError('Must be positive');
            } else {
                this.heightInput.setError('');
            }
        }
        this.updateVolume();
    }

    validateWidth() {
        if (this.widthInput.isEmpty()) {
            this.widthInput.setError('');
        } else {
            const value = this.widthInput.getValue();
            if (value === null) {
                this.widthInput.setError('Invalid number');
            } else if (value <= 0) {
                this.widthInput.setError('Must be positive');
            } else {
                this.widthInput.setError('');
            }
        }
        this.updateArea();
    }

    validateLength() {
        if (this.lengthInput.isEmpty()) {
            this.lengthInput.setError('');
        } else {
            const value = this.lengthInput.getValue();
            if (value === null) {
                this.lengthInput.setError('Invalid number');
            } else if (value <= 0) {
                this.lengthInput.setError('Must be positive');
            } else {
                this.lengthInput.setError('');
            }
        }
        this.updateArea();
    }
}

// Initialize application
const app = new Application();

// Event listeners
document.getElementById('fee').addEventListener('input', () => app.validateFee());
document.getElementById('count').addEventListener('input', () => app.validateCount());
document.getElementById('discount').addEventListener('input', () => app.validateDiscount());
document.getElementById('radius').addEventListener('input', () => app.validateRadius());
document.getElementById('height').addEventListener('input', () => app.validateHeight());
document.getElementById('width').addEventListener('input', () => app.validateWidth());
document.getElementById('length').addEventListener('input', () => app.validateLength());