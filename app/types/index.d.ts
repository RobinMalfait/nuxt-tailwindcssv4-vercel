import FieldWrapper from "~/components/Ui/Form/FieldWrapper.vue";

type SqlDate = `${number}-${number}-${number} ${number}:${number}:${number}`

declare global {
  interface ApiResource {
    '@id': `/${string}`
    '@context': `/contexts/${string}`
    '@type': string
    [key: string]: any
  }

  interface Author extends ApiResource {
    id: number
    institutions: Institution[]
    firstName: string
    lastName: string
    email: string
    competingInterests: string
    orcId: null|string
  }

  interface User extends Author {
    '@context': '/contexts/User'
    '@id': `/users/${Author.id}`
    '@type': 'User'
    institutions: UserInstitution[]
    username: string
    newUsername: null|string
  }

  interface Institution extends ApiResource {
    name: string
    department: string
    addressStreet: string
    addressCity: string
    addressPostcode: string
    addressCountry: string
    created: SqlDate
    modified: SqlDate
  }

  interface UserInstitution extends Institution {
    '@id': `/account/user_institutions/${string}`
    '@context': '/contexts/UserInstitution'
    '@type': 'UserInstitution'
    user: User['@id']
  }

  interface PaperResource extends ApiResource {
    '@id': `/account/papers/${string}`
    user: User['@id']
    studyType: string
  }

  interface PaperAuthor extends Author {
    '@context': '/contexts/PaperAuthor'
    '@id': `/account/paper_authors/${Author.id}`
    '@type': 'PaperAuthor'
    institutions: PaperAuthorInstitution[]
    username: string
    newUsername: null|string
    id: number
  }

  interface PaperAuthorInstitution extends Institution {
    '@id': `/account/paper_author_institutions/${string}`
    '@context': '/contexts/PaperAuthorInstitution'
    '@type': 'PaperAuthorInstitution'
    paperAuthor: PaperAuthor['@id']
  }

  // PaperAuthorInstitution

  type PartialResource<T extends ApiResource> = Omit<Partial<T>, '@id'> & (T['@id'] | UnwrapRef<T["@id"]>)
  type ComponentProps<T> = InstanceType<T>["$props"]
}

export {}
