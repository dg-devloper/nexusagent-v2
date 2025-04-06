/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm'
import { iWhatsapp } from '../../Interface'
import { ChatFlow } from './ChatFlow'

@Entity()
export class Whatsapp implements iWhatsapp {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar' })
    chatflowId: string

    @OneToOne(() => ChatFlow)
    @JoinColumn()
    chatflow: ChatFlow

    @Column({ type: 'varchar' })
    userId: string

    @Column({ type: 'varchar' })
    sessionId: string

    @Column({ type: 'varchar' })
    phoneNumber: string

    @Column({ type: 'boolean' })
    isActive: boolean

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    createdDate: Date

    @Column({ type: 'timestamp' })
    @UpdateDateColumn()
    updatedDate: Date
}
