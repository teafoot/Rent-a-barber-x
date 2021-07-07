module.exports = {
    defaultServerResponse: {
        status: 400,
        message: '',
        body: {}
    },
    productMessage: {
        PRODUCT_CREATED: 'Product created successfully',
        PRODUCT_FETCHED: 'Product fetched successfully',
        PRODUCT_UPDATED: 'Product updated successfully',
        PRODUCT_DELETED: 'Product deleted successfully',
        PRODUCT_NOT_FOUND: 'Product not found'
    },
    userMessage: {
        SIGNUP_SUCCESS: 'Sign up success',
        LOGIN_SUCCESS: 'Login success',
        DUPLICATE_EMAIL: 'Email address already exists',
        USER_NOT_FOUND: 'User not found',
        BARBERS_NOT_FOUND: 'Barbers not found',
        INVALID_PASSWORD: 'Incorrect password',
        PROFILE_INVALID_SAVE: 'Error saving profile',
        PROFILE_VALID_SAVE: 'Profile saved successfully'
    },
    barbershopMessage: {
        REGISTRATION_SUCCESS: 'Registered success',
        REGISTRATION_FAILURE: 'Failed in registering',
        BARBERSHOP_SERVICE_CREATION_SUCCESS: 'Barbershop service registered successfully',
        BARBERSHOP_SERVICE_CREATION_FAILURE: 'Failed registering barbershop service',
        BARBERSHOP_SERVICE_DELETION_SUCCESS: 'Barbershop service deletion successful',
        BARBERSHOP_SERVICE_DELETION_FAILURE: 'Failed deleting barbershop service',
        BARBERSHOP_NOT_FOUND: 'Barbershop not found',
    },
    messageMessage: {
        SAVED_SUCCESS: 'Message was saved successfully'
    },
    requestValidationMessage: {
        BAD_REQUEST: 'Invalid fields',
        TOKEN_MISSING: 'Token missing from header',
        NOT_BARBER: 'Not a barber',
        RECIPIENT_CANNOT_BE_SELF: 'The recipient of the message cannot be you'
    },
    databaseMessage: {
        INVALID_ID: 'Invalid ID'
    }
};
