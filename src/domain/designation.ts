import { add } from 'date-fns'
import { z } from 'zod'

export class Designation {
  constructor(
    public id: string | null = null,
    public customTitle: string = '',
    public description: string | null = '',
    public electionDate: Date | null = null,
    public voteStartDate: Date = add(new Date(), { days: 16 }),
    public voteEndDate: Date = add(new Date(), { days: 17 }),
    public target: string[] = [],
    public questions: Question[] = []
  ) {}

  static NULL = new Designation()

  static fromFormData(formData: DesignationType): Designation {
    return new Designation(
      null,
      formData.customTitle,
      formData.description,
      null,
      formData.voteStartDate,
      formData.voteEndDate,
      formData.target,
      formData.questions.map(
        q =>
          new Question(
            q.content,
            q.choices.map(c => new QuestionChoice(c.content))
          )
      )
    )
  }
}

class Question {
  constructor(
    public content: string,
    public choices: QuestionChoice[] = []
  ) {}
}

class QuestionChoice {
  constructor(public content: string) {}
}

const schemaCreateQuestionChoice = z.object({
  content: z.string().min(2, 'Le contenu doit contenir au moins 2 caractères.'),
})

const schemaCreateQuestion = z.object({
  content: z.string().min(2, 'Le contenu doit contenir au moins 2 caractères.'),
  choices: z.array(schemaCreateQuestionChoice).nonempty('Veuillez ajouter au moins un bulletin.'),
})

export const schemaCreateDesignation = z.object({
  customTitle: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(255, "Le titre de l'événement doit contenir au moins 5 caractères"),
  description: z
    .string()
    .min(50, 'La description doit contenir au moins 50 caractères.')
    .max(1000, 'La description doit contenir moins de 1000 caractères'),
  voteStartDate: z
    .date({
      invalid_type_error: 'La date de début doit être une date',
      required_error: 'La date de début est obligatoire',
    })
    .min(add(new Date(), { days: 3 }), 'La date de début ne peut pas être inférieure à la date du jour + 3 jours.'),
  voteEndDate: z
    .date({
      invalid_type_error: 'La date de fin doit être une date',
      required_error: 'La date de fin est obligatoire',
    })
    .min(add(new Date(), { days: 3, hours: 1 }), 'La date de fin ne peut pas être inférieure à la date du début.')
    .max(add(new Date(), { days: 10 }), 'La durée ne peut pas dépasser 7 jours.'),
  target: z.array(z.string()).min(1, 'Veuillez sélectionner au moins un choix.'),
  questions: z.array(schemaCreateQuestion).nonempty('Veuillez ajouter au moins une question.'),
})

export type DesignationType = z.infer<typeof schemaCreateDesignation>
