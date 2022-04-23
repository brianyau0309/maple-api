import { ApiProperty } from '@nestjs/swagger';

export class DeleteMusicResult {
  @ApiProperty({ type: Boolean })
  acknowledged: boolean;

  @ApiProperty({ type: Number })
  deletedCount: number;
}

export class CleanMusicResponse {
  @ApiProperty({ description: 'Delete state ', type: DeleteMusicResult })
  bulkDeleteState: DeleteMusicResult;

  @ApiProperty({
    description: 'Deleted music list',
    type: String,
    isArray: true,
  })
  deleted: string[];
}
