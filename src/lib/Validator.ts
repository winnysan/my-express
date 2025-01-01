import { Request } from 'express'

/**
 * Represents a single validation error
 */
interface ValidationError {
  field: string
  message: string
}

/**
 * Class representing validation logic for request fields
 */
class Validator {
  private req: Request
  public errors: ValidationError[] = []
  private validations: Array<() => Promise<void> | void> = []

  /**
   * Create an instance of Validation
   * @param req
   */
  constructor(req: Request) {
    this.req = req
  }

  /**
   * Adds an error to the errors array
   * @param field
   * @param message
   */
  public addError(field: string, message: string): void {
    this.errors.push({ field, message })
  }

  /**
   * Gets the value of field from the request
   * @param name
   * @returns
   */
  public getFieldValue(name: string): any {
    return this.req.body[name]
  }

  /**
   * Adds a validation function to the validation list
   * @param fn
   */
  public addValidation(fn: () => Promise<void> | void): void {
    this.validations.push(fn)
  }

  /**
   * Run all validation funcions
   */
  public async runValidations(): Promise<void> {
    for (const validationFn of this.validations) {
      await validationFn()
    }
  }

  /**
   *
   * @param name Gets a validator object for a specific field
   * @returns
   */
  public field(name: string): FieldValidator {
    return new FieldValidator(this, name)
  }
}

/**
 * Class representing validation methods for a specific field
 */
class FieldValidator {
  private validation: Validator
  private name: string

  /**
   * Creates an instance of FieldValidator
   * @param validation
   * @param name
   */
  constructor(validation: Validator, name: string) {
    this.validation = validation
    this.name = name
  }

  /**
   * Checks if the field is present and not empty
   * @param message
   * @returns
   */
  public required(message?: string): this {
    this.validation.addValidation(() => {
      const value = this.validation.getFieldValue(this.name)

      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        this.validation.addError(
          this.name,
          message || global.dictionary.validation.fieldIsRequiredDefault.replace(/::field/, this.name)
        )
      }
    })

    return this
  }

  /**
   * Checks if the field constains a valid email address
   * @param message
   * @returns
   */
  public email(message?: string): this {
    this.validation.addValidation(() => {
      const value = this.validation.getFieldValue(this.name)
      const emailRegex = /\S+@\S+\.\S+/

      if (typeof value === 'string' && !emailRegex.test(value)) {
        this.validation.addError(this.name, message || global.dictionary.validation.invalidEmailAddressDefault)
      }
    })

    return this
  }

  /**
   * Checks if the field meets the minimum length requirement
   * @param length
   * @param message
   * @returns
   */
  public min(length: number, message?: string): this {
    this.validation.addValidation(() => {
      const value = this.validation.getFieldValue(this.name)

      if (typeof value === 'string' && value.length < length) {
        this.validation.addError(
          this.name,
          message ||
            global.dictionary.validation.fieldMustBeAtLeastCharacterDefault
              .replace(/::field/, this.name)
              .replace(/::length/, String(length))
        )
      }
    })

    return this
  }

  /**
   * Check if the field matches another field
   * @param otherFieldName
   * @param message
   * @returns
   */
  public confirm(otherFieldName: string, message?: string): this {
    this.validation.addValidation(() => {
      const value = this.validation.getFieldValue(this.name)
      const otherValue = this.validation.getFieldValue(otherFieldName)

      if (value !== otherValue) {
        this.validation.addError(
          this.name,
          message ||
            global.dictionary.validation.fieldDoesNotMatchOtherDefault
              .replace(/::field/, this.name)
              .replace(/::other/, otherFieldName)
        )
      }
    })

    return this
  }
}

export default Validator
