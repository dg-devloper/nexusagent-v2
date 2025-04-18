/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { ChatflowType, IChatFlow } from '../../Interface'
import { Whatsapp } from './Whatsapp'

@Entity()
export class ChatFlow implements IChatFlow {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar' })
    userId: string

    @Column()
    name: string

    @Column({ type: 'text' })
    flowData: string

    @Column({ nullable: true })
    deployed?: boolean

    @Column({ nullable: true })
    isPublic?: boolean

    @Column({ nullable: true })
    apikeyid?: string

    @Column({ nullable: true, type: 'text' })
    chatbotConfig?: string

    @Column({ nullable: true, type: 'text' })
    apiConfig?: string

    @Column({ nullable: true, type: 'text' })
    analytic?: string

    @Column({ nullable: true, type: 'text' })
    speechToText?: string

    @Column({ nullable: true, type: 'text' })
    followUpPrompts?: string

    @Column({ nullable: true, type: 'text' })
    category?: string

    @Column({ nullable: true, type: 'text' })
    type?: ChatflowType

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    createdDate: Date

    @Column({ type: 'timestamp' })
    @UpdateDateColumn()
    updatedDate: Date

    @OneToOne(() => Whatsapp, (whatsapp) => whatsapp.chatflow)
    whatsapp: Whatsapp
}
