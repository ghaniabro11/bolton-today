export enum Permission {
  // User Module
  READ_USER = "read:user",
  WRITE_USER = "write:user",
  EDIT_USER = "edit:user",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",

  // Category Module
  READ_CATEGORY = "read:category",
  WRITE_CATEGORY = "write:category",
  EDIT_CATEGORY = "edit:category",
  UPDATE_CATEGORY = "update:category",
  DELETE_CATEGORY = "delete:category",

  // Author Module
  READ_AUTHOR = "read:author",
  WRITE_AUTHOR = "write:author",
  EDIT_AUTHOR = "edit:author",
  UPDATE_AUTHOR = "update:author",
  DELETE_AUTHOR = "delete:author",

    // Journoul Module
  READ_JOURNALIST = "read:journalist",
  WRITE_JOURNALIST = "write:journalist",
  EDIT_JOURNALIST = "edit:journalist",
  UPDATE_JOURNALIST = "update:journalist",
  DELETE_JOURNALIST = "delete:journalist",

  // Contributor Module
  READ_CONTRIBUTOR = "read:contributor",
  WRITE_CONTRIBUTOR = "write:contributor",
  EDIT_CONTRIBUTOR = "edit:contributor",
  UPDATE_CONTRIBUTOR = "update:contributor",
  DELETE_CONTRIBUTOR = "delete:contributor",

  // Politician Module
  READ_POLITICIAN = "read:politician",
  WRITE_POLITICIAN = "write:politician",
  EDIT_POLITICIAN = "edit:politician",
  UPDATE_POLITICIAN = "update:politician",
  DELETE_POLITICIAN = "delete:politician",

  // News Module
  READ_NEWS = "read:news",
  WRITE_NEWS = "write:news",
  EDIT_NEWS = "edit:news",
  UPDATE_NEWS = "update:news",
  DELETE_NEWS = "delete:news",

  // Media Module
  READ_MEDIA = "read:media",
  WRITE_MEDIA = "write:media",
  EDIT_MEDIA = "edit:media",
  UPDATE_MEDIA = "update:media",
  DELETE_MEDIA = "delete:media",

  // Magazine Module
  READ_MAGAZINE = "read:magazine",
  WRITE_MAGAZINE = "write:magazine",
  EDIT_MAGAZINE = "edit:magazine",
  UPDATE_MAGAZINE = "update:magazine",
  DELETE_MAGAZINE = "delete:magazine",
}
export const AdminPermission: Permission[] = [
  // User Module
  Permission.READ_USER,
  Permission.WRITE_USER,
  Permission.EDIT_USER,
  Permission.UPDATE_USER,
  Permission.DELETE_USER,

  // Category Module
  Permission.READ_CATEGORY,
  Permission.WRITE_CATEGORY,
  Permission.EDIT_CATEGORY,
  Permission.UPDATE_CATEGORY,
  Permission.DELETE_CATEGORY,

  // Author Module
  Permission.READ_AUTHOR,
  Permission.WRITE_AUTHOR,
  Permission.EDIT_AUTHOR,
  Permission.UPDATE_AUTHOR,
  Permission.DELETE_AUTHOR,

  // Journalist Module
  Permission.READ_JOURNALIST,
  Permission.WRITE_JOURNALIST,
  Permission.EDIT_JOURNALIST,
  Permission.UPDATE_JOURNALIST,
  Permission.DELETE_JOURNALIST,

  // Contributor Module
  Permission.READ_CONTRIBUTOR,
  Permission.WRITE_CONTRIBUTOR,
  Permission.EDIT_CONTRIBUTOR,
  Permission.UPDATE_CONTRIBUTOR,
  Permission.DELETE_CONTRIBUTOR,

  // POLITICIAN Module
  Permission.READ_POLITICIAN,
  Permission.WRITE_POLITICIAN,
  Permission.EDIT_POLITICIAN,
  Permission.UPDATE_POLITICIAN,
  Permission.DELETE_POLITICIAN,

  // News Module
  Permission.READ_NEWS,
  Permission.WRITE_NEWS,
  Permission.EDIT_NEWS,
  Permission.UPDATE_NEWS,
  Permission.DELETE_NEWS,

  // Media Module
  Permission.READ_MEDIA,
  Permission.WRITE_MEDIA,
  Permission.EDIT_MEDIA,
  Permission.UPDATE_MEDIA,
  Permission.DELETE_MEDIA,

  // Magazine Module
  Permission.READ_MAGAZINE,
  Permission.WRITE_MAGAZINE,
  Permission.EDIT_MAGAZINE,
  Permission.UPDATE_MAGAZINE,
  Permission.DELETE_MAGAZINE,
];

export const EditorPermission: Permission[] = [
  // User Module
  Permission.READ_USER,
  Permission.WRITE_USER,
  Permission.UPDATE_USER,

  // Category Module
  Permission.READ_CATEGORY,
  Permission.WRITE_CATEGORY,
  Permission.UPDATE_CATEGORY,

  // Author Module
  Permission.READ_AUTHOR,
  Permission.WRITE_AUTHOR,
  Permission.UPDATE_AUTHOR,

  // Author Module
  Permission.READ_JOURNALIST,
  Permission.WRITE_JOURNALIST,
  Permission.UPDATE_JOURNALIST,

  Permission.READ_CONTRIBUTOR,
  Permission.WRITE_CONTRIBUTOR,
  Permission.UPDATE_CONTRIBUTOR,

  Permission.READ_POLITICIAN,
  Permission.WRITE_POLITICIAN,
  Permission.UPDATE_POLITICIAN,
  
  // News Module
  Permission.READ_NEWS,
  Permission.WRITE_NEWS,
  Permission.UPDATE_NEWS,

  // Media Module
  Permission.READ_MEDIA,
  Permission.WRITE_MEDIA,
  Permission.UPDATE_MEDIA,

  // Magazine Module
  Permission.READ_MAGAZINE,
  Permission.WRITE_MAGAZINE,
  Permission.UPDATE_MAGAZINE,
];
