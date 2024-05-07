import React from 'react';
import styles from '@/styles/CircleCheckbox.module.css' // import CSS file with custom styles

export default function CircleCheckbox({ name, label, isChecked, onChange }) {
    return (
        <label className={styles.circleCheckbox}>
            <input
                type="checkbox"
                name={name}
                checked={isChecked}
                onChange={onChange}
                className={styles.circleInput}
            />
            <span className={styles.checkmark}></span>
            {label}
        </label>
    );
}