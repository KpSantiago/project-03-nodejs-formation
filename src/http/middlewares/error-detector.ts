import { IncorrectCredentialsError } from "../../use-cases/errors/incorrect-credentials-error"
import { LateCheckInValidationError } from "../../use-cases/errors/late-check-in-validation-error"
import { MaxDistanceError } from "../../use-cases/errors/max-distance-error"
import { MaxNumberOFCheckInError } from "../../use-cases/errors/max-number-of-check-in-error"
import { ResourceNotFoundError } from "../../use-cases/errors/resource-not-found-error"
import { UserAlreadyExistsError } from "../../use-cases/errors/user-already-exists-error"

export function errorDetector(error: any) {
    const errorArray = [
        { error_type: MaxDistanceError, status: 400 }, { error_type: ResourceNotFoundError, status: 404 }, { error_type: IncorrectCredentialsError, status: 400 }, { error_type: LateCheckInValidationError, status: 400 },
        { error_type: MaxNumberOFCheckInError, status: 400 }, { error_type: UserAlreadyExistsError, status: 409 }
    ]
    const err = errorArray.find(e => error instanceof e.error_type);

    return err;
}