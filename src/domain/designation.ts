import { add } from 'date-fns'
import { z } from 'zod'
import { getRoundedDate, parseDate } from '~/shared/helpers'

export enum DesignationTypeEnum {
  Consultation = 'consultation',
  CommitteeSupervisor = 'committee_supervisor',
}

export class Designation {
  constructor(
    public id: string | null = null,
    public customTitle: string = '',
    public description: string = '',
    public electionDate: Date | null = null,
    public type: DesignationTypeEnum | null = null,
    public electionEntityIdentifier: string | null = null,
    public voteStartDate: Date = Designation.minVoteStartDate(),
    public voteEndDate: Date = Designation.minVoteEndDate(),
    public targetYear: number | null = null,
    public questions: Question[] = [],
    public createdAt: Date | null = null,
    public isFullyEditable: boolean = true,
    public isCanceled: boolean = false
  ) {}

  static minVoteStartDate() {
    return getRoundedDate(add(new Date(), { days: 3 }))
  }

  static minVoteEndDate() {
    return getRoundedDate(add(new Date(), { days: 3, hours: 1 }))
  }

  static NULL = new Designation()

  static fromFormData(type: DesignationTypeEnum, formData: DesignationType, id?: string | null): Designation {
    return new Designation(
      id,
      formData.customTitle,
      formData.description,
      null,
      type,
      null,
      formData.voteStartDate,
      formData.voteEndDate,
      formData.targetYear,
      formData.questions?.map(
        q =>
          new Question(
            q.content,
            q.choices.map(c => new QuestionChoice(c.label))
          )
      )
    )
  }

  toFormData(): DesignationType {
    return <DesignationType>{
      customTitle: this.customTitle,
      description: this.description,
      voteStartDate: this.voteStartDate,
      voteEndDate: this.voteEndDate,
      targetYear: this.targetYear,
      questions:
        this.questions.length > 0
          ? this.questions
          : [new Question('', [new QuestionChoice(''), new QuestionChoice('')])],
    }
  }

  static fromApi(data: any): Designation {
    return new Designation(
      data.uuid,
      data.custom_title,
      data.description,
      data.election_date ? parseDate(data.election_date) : null,
      data.type as DesignationTypeEnum,
      data.election_entity_identifier,
      parseDate(data.vote_start_date),
      parseDate(data.vote_end_date),
      data.target_year,
      data.questions?.map(
        (q: any) =>
          new Question(
            q.content,
            q.choices.map((c: any) => new QuestionChoice(c.label))
          )
      ),
      parseDate(data.created_at),
      data.fully_editable,
      data.is_canceled
    )
  }

  toJson() {
    return {
      type: this.type,
      custom_title: this.customTitle,
      description: this.description,
      vote_start_date: this.voteStartDate,
      vote_end_date: this.voteEndDate,
      targetYear: this.targetYear,
      election_entity_identifier: this.electionEntityIdentifier,
      questions: this.questions,
    }
  }
}

class Question {
  constructor(
    public content: string,
    public choices: QuestionChoice[] = []
  ) {}
}

class QuestionChoice {
  constructor(public label: string) {}
}

const schemaCreateQuestionChoice = z.object({
  label: z
    .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(255, 'Le contenu doit contenir moins de 255 caractères.'),
})

const schemaCreateQuestion = z.object({
  content: z
    .string()
    .min(2, 'Le contenu doit contenir au moins 2 caractères.')
    .max(500, 'Le contenu doit contenir moins de 500 caractères.'),
  choices: z.array(schemaCreateQuestionChoice).nonempty('Veuillez ajouter au moins un bulletin.'),
})

export const schemaPartialDesignation = z.object({
  customTitle: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(255, "Le titre de l'événement doit contenir moins de 255 caractères"),
  description: z
    .string()
    .min(50, 'La description doit contenir au moins 50 caractères.')
    .max(1000, 'La description doit contenir moins de 1000 caractères'),
})

export const schemaCreateDesignation = schemaPartialDesignation
  .extend({
    voteStartDate: z
      .date({
        invalid_type_error: 'La date de début doit être une date',
        required_error: 'La date de début est obligatoire',
      })
      .min(Designation.minVoteStartDate(), 'La date de début ne peut pas être inférieure à la date du jour + 3 jours.'),
    voteEndDate: z
      .date({
        invalid_type_error: 'La date de fin doit être une date',
        required_error: 'La date de fin est obligatoire',
      })
      .min(Designation.minVoteEndDate(), 'La date de fin ne peut pas être inférieure à la date du début.'),
    targetYear: z.number({
      required_error: 'Veuillez sélectionner au moins un choix.',
    }),
    questions: z.array(schemaCreateQuestion).min(1, 'Veuillez ajouter au moins une question.'),
  })
  .superRefine((data, ctx) => {
    if (!data.voteEndDate || !data.voteStartDate) {
      return
    }

    if (data.voteEndDate <= data.voteStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'La date de fin doit être postérieure à la date de début.',
        path: ['voteEndDate'],
      })
      return
    }

    if (add(data.voteStartDate, { days: 7 }) < data.voteEndDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'La durée ne doit pas dépasser 7 jours.',
        path: ['voteEndDate'],
      })
    }
  })

export type DesignationType = z.infer<typeof schemaCreateDesignation>
