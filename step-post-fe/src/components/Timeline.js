function Timeline(props) {
    return (
        <>
            {
                props.statuts.map((statut) => {
                    return(
                        <>
                            <div className="cercle"></div>
                        </>
                    )
                })
            }
        </>
    )
}

export default Timeline;