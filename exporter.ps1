# Get export folder
Function Get-Folder($initialDirectory) {
    [System.Reflection.Assembly]::LoadWithPartialName("System.windows.forms") | Out-Null
    $foldername = New-Object System.Windows.Forms.FolderBrowserDialog
    $foldername.Description = "Select 'exports' in the project directory"
    
    # Set the root folder to the 'exports' subdirectory of the current script's directory
    $exportsPath = Join-Path -Path $PSScriptRoot -ChildPath "exports"
    
    # Check if the 'exports' directory exists, if not, use the script's directory
    if (Test-Path $exportsPath) {
        $foldername.SelectedPath = $exportsPath
    } else {
        $foldername.SelectedPath = $PSScriptRoot
    }
    
    if ($foldername.ShowDialog() -eq "OK") {
        $folder = $foldername.SelectedPath
    }
    return $folder
}

# Spider and find each page, create directory for each group
Function Spider-OneNote-Notebook {
	param( $onenote, $node, $path )
	foreach($child in $node.ChildNodes) {
		if ($child.HasChildNodes) {
			if ($child.isRecycleBin -ne 'true') {
				$folder = Join-Path -Path $path -ChildPath $child.name
				New-Item -Path $folder -ItemType directory | Out-Null
				Write-Host "Section: $($folder)"
				Spider-OneNote-Notebook -onenote $onenote -node $child -path $folder
			}
		} else {
			Export-OneNote-Page -onenote $onenote -node $child -path $path
		}
	}
}

# Export page
Function Export-OneNote-Page {
	param( $onenote, $node, $path )
	# Replace invalid file characters
	$name = ReplaceIllegal -text $node.name
	$file = $(Join-Path -Path $path -ChildPath "$($name).htm")
	Write-Host "Page: $($file)"
	# Export
	$onenote.Publish($node.ID, $file, 7, "")
	Export-OneNote-Attachments -onenote $onenote -node $node -path $path
}

# Copy embedded attachments
Function Export-OneNote-Attachments {
	param ( $onenote, $node, $path )
	$xml = ''
	$schema = @{one=�http://schemas.microsoft.com/office/onenote/2013/onenote�}
	$onenote.GetPageContent($node.ID, [ref]$xml)
	$xml | Select-Xml -XPath "//one:Page/one:Outline/one:OEChildren/one:OE/one:InsertedFile" -Namespace $schema | foreach {
		$file = Join-Path -Path $path -ChildPath $_.Node.preferredName
		Write-Host "Attachment: $($file)"
		Copy-Item $_.Node.pathCache -Destination $file
	}
}

Function ReplaceIllegal {
	param ( $text )
	$illegal = [string]::join('',([System.IO.Path]::GetInvalidFileNameChars())) -replace '\\','\\'
	$replaced = $text -replace "[$illegal]",'_'
	return $replaced
}

# Get export folder
$folder = Get-Folder

# Connect
$OneNote = New-Object -ComObject OneNote.Application
[xml]$Hierarchy = ""
$OneNote.GetHierarchy("", [Microsoft.Office.InterOp.OneNote.HierarchyScope]::hsPages, [ref]$Hierarchy)

# Loop over each notebook
foreach ($notebook in $Hierarchy.Notebooks.Notebook ) {
	$name = ReplaceIllegal -text $notebook.name
	$nf = Join-Path -Path $folder -ChildPath $name
	Write-Host "Notebook: $($nf)"
	New-Item -Path $nf -ItemType directory | Out-Null
	Spider-OneNote-Notebook -onenote $OneNote -node $notebook -path $nf
}