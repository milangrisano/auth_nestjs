import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('Users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;
    
    @Column('text')
    lastName: string;

    @Column('text', {
        unique: true //!OJO: esto permite que los correos electronicos no se repitan,
                     //! verificar si es conveniente, tiene que haber un key que puede ser el telef o email
    })
    email: string;

    @Column('text',{
        select: false
    })
    password: string;

    @Column({
         type: 'bool',
         default: false
     })
    isActive: boolean;

    @CreateDateColumn()
    createOn: Date;


    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate() 
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}