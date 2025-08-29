import styles from "./mentorStuForm2UI.module.css";


const DetailsTable = ({ data, handleMarksChange, readOnly }) => {
    return (
        <table className={styles.mentorTable}>
            <thead>
                <tr>
                    <th colSpan={3}>{data.parameter}</th>
                </tr>
                <tr>
                    <th style={{fontSize: '1.3rem', fontWeight: 600}}> </th>
                    <th style={{fontSize: '1.3rem', fontWeight: 600}}>Details</th>
                    <th style={{fontSize: '1.3rem', fontWeight: 600}}>Marks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowSpan="4" style={{fontWeight: 600, fontSize: '1.2rem'}}>{data.title}</td>
                    <td>{data.details[0].label}</td>
                    <td>{data.details[0].marks}</td>
                </tr>
                <tr>
                    <td>{data.details[1].label}</td>
                    <td>{data.details[1].marks}</td>
                </tr>
                <tr>
                    <td>{data.details[2].label}</td>
                    <td>{data.details[2].marks}</td>
                </tr>
                <tr className={styles.marksObtainedRow}>
                    <td style={{fontWeight: 600}}>Marks obtained</td>
                    <td>
                        <select
                            disabled={readOnly}
                            className={styles.marksSelect}
                            value={data.marksObtained}
                            onChange={(e) => handleMarksChange(data.parameter, Number(e.target.value))}
                        >
                            {[0, 1, 2, 3, 4].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default DetailsTable;