import { profile } from "console";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;
    
    @Column('text', {
        name: 'last_name',
    })
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
         default: false,
         name: 'is_active'
     })
    isActive: boolean;

    @Column({
        type: 'boolean',
        unique: true,
        name: 'activatio_token'
    })
    activationToken: string;

    @CreateDateColumn({
        name: 'create_on'
    })
    createOn: Date;


    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];



    // @OneToOne(
    //     () => Profile,
    //     (profile) => profile.user,
    // )
    // profile?: Profile;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate() 
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}