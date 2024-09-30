import { add } from 'date-fns'

export class Designation {
  constructor(
    public id: string | null,
    public customTitle: string,
    public description: string | null,
    public electionDate: Date | null,
    public voteStartDate: Date,
    public voteEndDate: Date
  ) {}

  static NULL = new Designation(null, '', '', null, add(new Date(), { days: 16 }), add(new Date(), { days: 17 }))
}
