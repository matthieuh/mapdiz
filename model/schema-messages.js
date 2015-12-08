SimpleSchema.messages({
  required: "[label] est requis",
  minString: "[label] doit avoir au moins [min] caractères",
  maxString: "[label] ne doit pas dépasser [max] caractères",
  minNumber: "[label] doit être au moins [min]",
  maxNumber: "[label] ne peut pas dépasser [max]",
  minDate: "[label] doit être identique ou avant [min]",
  maxDate: "[label] ne peut pas être après [max]",
  badDate: "[label] n'est pas une date valide",
  minCount: "Vous ne pouvez spécifier qu'au moins [minCount] valeurs",
  maxCount: "Vous ne pouvez pas spécifier plus de [maxCount] valeurs",
  noDecimal: "[label] doit être un entier",
  notAllowed: "[value] n'est pas une valeur autorisée",
  expectedString: "[label] doit être de type : string",
  expectedNumber: "[label] doit être de type : number",
  expectedBoolean: "[label] doit être de type : boolean",
  expectedArray: "[label] doit être de type : array",
  expectedObject: "[label] doit être de type : object",
  expectedConstructor: "[label] doit être un [type]",
  regEx: [
    {msg: "[label] failed regular expression validation"},
    {exp: SimpleSchema.RegEx.Email, msg: "[label] doit être une adresse mail valide"},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] doit être une adresse mail valide"},
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] doit être un domaine valide"},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] doit être un domaine valide"},
    {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},
    {exp: SimpleSchema.RegEx.Url, msg: "[label] doit être une URL valide"},
    {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"}
  ],
  keyNotInSchema: "[key] n'est pas autorisé dans ce schéma"
});
