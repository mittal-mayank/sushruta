function identity(inp) {
    return inp;
}

function mandatoryDecider() {
    throw new Error();
}

function optionalDecider() {
    return;
}

function parseAndPopulate(inpArgs, parse, populate) {
    for (const key in inpArgs) {
        const val = parse(inpArgs[key]);
        populate(key, val);
    }
}

function validateStrings(inpArgs, outArgs, decider) {
    parseAndPopulate(inpArgs, identity, (key, val) => {
        if (val) outArgs[key] = val;
        else decider();
    });
}

function validateNumbers(inpArgs, outArgs, decider) {
    parseAndPopulate(inpArgs, parseInt, (key, val) => {
        if (val) outArgs[key] = val;
        else decider();
    });
}

function validateIds(inpArgs, outArgs, decider) {
    parseAndPopulate(inpArgs, identity, (key, val) => {
        if (val.length === 24) outArgs[key] = val;
        else decider();
    });
}

function validateBooleans(inpArgs, outArgs, decider) {
    parseAndPopulate(inpArgs, identity, (key, val) => {
        if (val === 'true') outArgs[key] = true;
        else if (val === 'false') outArgs[key] = false;
        else decider();
    });
}

function validateDates(inpArgs, outArgs, decider) {
    parseAndPopulate(
        inpArgs,
        (inp) => new Date(inp),
        (key, val) => {
            if (val.getTime()) outArgs[key] = val;
            else decider();
        }
    );
}

function dataTypesValidator({ mandatoryArgs, optionalArgs }) {
    const args = {};
    try {
        if (mandatoryArgs) {
            validateStrings(mandatoryArgs.strings, args, mandatoryDecider);
            validateNumbers(mandatoryArgs.numbers, args, mandatoryDecider);
            validateIds(mandatoryArgs.ids, args, mandatoryDecider);
            validateBooleans(mandatoryArgs.booleans, args, mandatoryDecider);
            validateDates(mandatoryArgs.dates, args, mandatoryDecider);
        }

        if (optionalArgs) {
            validateStrings(optionalArgs.strings, args, optionalDecider);
            validateNumbers(optionalArgs.numbers, args, optionalDecider);
            validateIds(optionalArgs.ids, args, optionalDecider);
            validateBooleans(optionalArgs.booleans, args, optionalDecider);
            validateDates(mandatoryArgs.dates, args, optionalDecider);
        }

        return args;
    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports = dataTypesValidator;
