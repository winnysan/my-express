export type Dictionary = {
  navigation: {
    home: string
    posts: string
    addNewPost: string
    admin: string
    register: string
    login: string
    logout: string
    forgotPasswordQ: string
    profile: string
  }
  title: {
    homePage: string
    postsPage: string
    newPostPage: string
    adminPage: string
    registerPage: string
    loginPage: string
    forgotPasswordPage: string
    resetPasswordPage: string
    profilePage: string
    errorPage: string
  }
  messages: {
    somethingWentWrong: string
    notFound: string
    youHaveBeenRegisteredAndLoggedIn: string
    youHaveBeenLoggedIn: string
    youHaveBeenLoggedOut: string
    invalidCredentials: string
    invalidPassword: string
    csrfTokenNotAvailable: string
    invalidData: string
    unknownAction: string
    invalidDataForUpdate: string
    unauthorized: string
    postCreated: string
    postEdited: string
    postDeleted: string
    emailNotExist: string
    userNotExist: string
    emailSent: string
    invalidLink: string
    passwordChanged: string
    passwordChangedAndLogout: string
    saved: string
  }
  pages: {
    error: string
    helloE: string
    posts: string
    newPost: string
    admin: string
    register: string
    login: string
    forgotPasswordQ: string
    resetPassword: string
    profile: string
    account: string
    passwordChange: string
    logoutAfterPasswordChange: string
    author: string
    published: string
    categories: string
    previous: string
    next: string
    page: string
    title: string
    body: string
    slug: string
    language: string
    createdAt: string
    updatedAt: string
    actions: string
    latest: string
    nextPosts: string
    letsCodeExpressDifferently: string
  }
  form: {
    email: string
    name: string
    password: string
    oldPassword: string
    newPassword: string
    passwordConfirmation: string
    title: string
    body: string
    categories: string
    selectCategories: string
    search: string
    searchPosts: string
    languages: string
    authors: string
    anyAuthors: string
    sortBy: string
    dateCreated: string
    lastUpdated: string
    orderBy: string
    ascending: string
    descending: string
    perPage: string
    submit: string
  }
  validation: {
    fieldIsRequiredDefault: string
    invalidEmailAddressDefault: string
    fieldMustBeAtLeastCharacterDefault: string
    fieldDoesNotMatchOtherDefault: string
    fieldMustByUniqueDefault: string
    errorCheckingUniquenessForFieldDefault: string
    invalidFileFormat: string
  }
  categories: {
    categories: string
    addFirst: string
    new: string
    en: string
    sk: string
    firstCategoryCreated: string
    missingCatedoryIdToAddAfter: string
    categoryNotFound: string
    categoryCreated: string
    missingParentCategoryId: string
    parentCategoryNotFound: string
    nestedCategoryCreated: string
    missingCategoryIdToDelete: string
    categoryDeleted: string
    missingCategoryIdToMoveUp: string
    categoryIsAlreadyAtTheTop: string
    previousCategoryNotFound: string
    categoryMovedUp: string
    missingCategoryIdToMoveDown: string
    noCategoryToMoveDown: string
    categoryIsAlreadyAtTheEnd: string
    nextCategoryNotFound: string
    categoryMovedDown: string
    categoryRenamed: string
    categoryLocaleUpdated: string
  }
}
